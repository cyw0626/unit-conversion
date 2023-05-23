import React, {useState} from 'react';
import { Col, Row, Input, Select, Button, message, Tooltip } from 'antd';
import { SwapOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { StreamData } from '../../steam-data-conversion/steam-data.ts';

enum Unit {
    J = 'J',
    KJ = 'KJ',
    MJ = 'MJ',
    GJ = 'GJ',
    CAL = 'cal', // 卡路里
    KCAL = 'Kcal', // 千卡
    C = 'C', // 摄氏度
    F = 'F', // 华氏度
    KWh = 'KWh'
}

const originOptions = [{
    text: '焦（J）',
    value: Unit.J
},{
    text: '千焦（KJ）',
    value: Unit.KJ
}, {
    text: '兆焦（MJ）',
    value: Unit.MJ
}, {
    text: '吉焦（GJ）',
    value: Unit.GJ
}, {
    text: '卡（cal）',
    value: Unit.CAL
}, {
    text: '千卡（Kcal）',
    value: Unit.KCAL
}, {
    text: '摄氏度（℃）',
    value: Unit.C
}, {
    text: '华氏度（℉）',
    value: Unit.F
}];

const evolutionOptions = [{
    text: '千瓦时（KWh）',
    value: Unit.KWh
}];

const findSuitVal = (originVal) => {
    let temp = 0;
    let calData = StreamData[0] as any;
    const data = StreamData.map((_, index) => {
        if (originVal == StreamData[index].temperature) {
            temp = index;
            calData = {
                "temperature": Number(_.temperature),
                "Hf": Number(_.Hf),
                "Hfg": Number(_.Hfg),
                "Hg": Number(_.Hg)
            };
        }

        if (originVal < StreamData[index].temperature && originVal > StreamData[index - 1].temperature) {
            temp = index;
            calData = {
                "temperature": originVal,
                "Hf": (Number(_.Hf) - Number(StreamData[index - 1].Hf)) / (Number(_.temperature) - Number(StreamData[index - 1].temperature)) * (originVal - Number(StreamData[index - 1].temperature)) + Number(StreamData[index - 1].Hf),
                "Hfg": (Number(_.Hfg) - Number(StreamData[index - 1].Hfg)) / (Number(_.temperature) - Number(StreamData[index - 1].temperature)) * (originVal - Number(StreamData[index - 1].temperature)) + Number(StreamData[index - 1].Hfg),
                "Hg": (Number(_.Hg) - Number(StreamData[index - 1].Hg)) / (Number(_.temperature) - Number(StreamData[index - 1].temperature)) * (originVal - Number(StreamData[index - 1].temperature)) + Number(StreamData[index - 1].Hg)
            };
        }

        return ({
            "temperature": Number(_.temperature),
            "pressure": Number(_.pressure),
            "density": Number(_.density),
            "Hf": Number(_.Hf),
            "Hfg": Number(_.Hfg),
            "Hg": Number(_.Hg)
        });
    }
    );
    return calData.Hg;
    // console.log('dedede', temp, data[temp], calData);
}

const Conversion = () => {
    const [origin, setOrigin] = useState('');
    const [btnDisabled, setBtnDisabled] = useState(true);
    const [originUnit, setOriginUnit] = useState(originOptions[0].value);
    const [weight, setWeight] = useState(1);
    const [evolution, setEvolution] = useState('');

    const originChange = (e) => {
        const val = e.target.value;
        setOrigin(val);
        if (val?.length && /^\d+(\.\d+)?$/.test(val)) {
            setBtnDisabled(false);
        } else {
            setBtnDisabled(true);
            return message.warning('请输入数字！');
        }
    };

    const onOriginUnitChange = (val) => {
        setEvolution('');
        setOriginUnit(val);
    }

    const handleWeightChange = (e) => {
        const val = e.target.value;
        if (/^[0-9]*$/.test(val)) {
            setWeight(val);
        } else {
            return message.warning('请输入数字！');
        }
    }

    const convert = () => {
        const originVal = Number(origin);
        let evolutionVal = 0;
        switch(originUnit) {
            case Unit.J:
                evolutionVal = originVal / 3600000;
                break;
            case Unit.KJ:
                evolutionVal = originVal / 3600;
                break;
            case Unit.MJ:
                evolutionVal = originVal / 3.6;
                break;
            case Unit.GJ:
                evolutionVal = originVal * 1000 / 3.6;
                break;
            case Unit.CAL:
                evolutionVal = originVal * 4.1868 / 3600000;
                break;
            case Unit.KCAL:
                evolutionVal = originVal * 1000 * 4.1868 / 3600000;
                break;
            case Unit.C:
                evolutionVal = findSuitVal(originVal) * weight / 3600;
                break;
            case Unit.F:
                evolutionVal = findSuitVal(originVal - 273) * weight / 3600;
                break;
        }
        setEvolution(String(evolutionVal));
    };

    return (
        <>
            <Row>
                <Col span={24}>
                    <h4>能量单位转换工具</h4>
                </Col>
            </Row>
            <Row>
                <Col span={10}>
                    <Input.TextArea
                        size='large'
                        placeholder='请输入要转换的值'
                        rows={4}
                        value={origin}
                        onChange={originChange}
                    />
                </Col>
                <Col span={4} style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <Button
                        type='primary'
                        onClick={convert}
                        disabled={btnDisabled}
                        size='large'
                        icon={<SwapOutlined />}
                    >转换</Button>
                </Col>
                <Col span={10}>
                    <Input.TextArea
                        placeholder='转换结果'
                        rows={4}
                        disabled
                        value={evolution}
                        size='large'
                    />
                </Col>
            </Row>
            <Row style={{marginTop: 10}}>
                <Col span={10} style={{ display: 'flex' }}>
                    <Select
                        style={{width: 220}}
                        placeholder={'请选择要转换的单位'}
                        size='large'
                        showSearch
                        optionFilterProp="children"
                        value={originUnit}
                        onChange={onOriginUnitChange}
                        filterOption={(input, option) => ((option?.value ?? '') as String).toLowerCase().includes(input.toLowerCase())}
                    >
                        {
                            originOptions.map(option => (
                                <Select.Option value={option.value} key={option.value}>
                                    {option.text}
                                </Select.Option>
                            ))
                        }
                    </Select>
                    {
                        (originUnit === Unit.C ||
                        originUnit === Unit.F) && (
                            <>
                                <Input
                                    style={{marginLeft: 20, width: 220}}
                                    size='large'
                                    addonAfter="Kg"
                                    value={weight}
                                    onChange={handleWeightChange}
                                />
                                <Tooltip title="默认为 1Kg 水蒸汽的能量">
                                    <QuestionCircleOutlined style={{marginTop: 
                                        10, marginLeft: 10}} />
                                </Tooltip>
                            </>
                        )
                    }
                </Col>
                <Col span={4}></Col>
                <Col span={10}>
                    <Select style={{width: 220}} defaultValue={evolutionOptions[0].value} size='large'>
                        {
                            evolutionOptions.map(option => (
                                <Select.Option value={option.value} key={option.value}>
                                    {option.text}
                                </Select.Option>
                            ))
                        }
                    </Select>
                </Col>
            </Row>
            <Row></Row>
        </>
    );
}

export default Conversion;

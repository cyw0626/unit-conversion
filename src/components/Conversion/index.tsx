import React, {useState} from 'react';
import { Col, Row, Input, Select, Button, message, Tooltip, Space, Statistic, Table } from 'antd';
import { SwapOutlined, QuestionCircleOutlined, RedoOutlined } from '@ant-design/icons';
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

const columns = [{
    title: '温度 T/℃',
    dataIndex: 'temperature',
    key: 'temperature',
}, {
    title: '绝对压强 P/kPa',
    dataIndex: 'pressure',
    key: 'pressure',
}, {
    title: '水蒸汽的密度 ρ/kg·m-3',
    dataIndex: 'density',
    key: 'density',
}, {
    title: '液体焓 H/kJ·kg-1',
    dataIndex: 'Hf',
    key: 'Hf',
}, {
    title: '汽化热 r/kJ·kg-1',
    dataIndex: 'Hfg',
    key: 'Hfg',
}, {
    title: '水蒸汽焓 H/kJ·kg-1',
    dataIndex: 'Hg',
    key: 'Hg',
}]

const findSuitVal = (originVal) => {
    let calData = StreamData[0] as any;
    StreamData.map((_, index) => {
        if (originVal == StreamData[index].temperature) {
            calData = {
                "temperature": Number(_.temperature),
                "Hf": Number(_.Hf),
                "Hfg": Number(_.Hfg),
                "Hg": Number(_.Hg)
            };
        }

        if ((StreamData[index]?.temperature && originVal < StreamData[index]?.temperature)
            && (StreamData[index - 1]?.temperature && originVal > StreamData[index - 1]?.temperature)) {
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
}

const Conversion = () => {
    const [origin, setOrigin] = useState('');
    const [originUnit, setOriginUnit] = useState(originOptions[0].value);
    const [weight, setWeight] = useState(1);
    const [evolution, setEvolution] = useState(0);

    const originChange = (e) => {
        const val = e.target.value;
        if (!val?.length || !/[^\d.-]/g.test(val)) {
            setOrigin(val);
        } else {
            return message.error('请输入数字！');
        }
    };

    const onOriginUnitChange = (val) => {
        setEvolution(0);
        setOriginUnit(val);
    }

    const handleWeightChange = (e) => {
        const val = e.target.value;
        if (!/[^\d.]/g.test(val)) {
            setWeight(val);
        } else {
            return message.error('请输入数字！');
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
                if (originVal < 0 || originVal > 375) {
                    return message.error('输入温度范围为 0℃ ~ 375℃');
                }
                evolutionVal = origin.length === 0 ? 0 : findSuitVal(originVal) * weight / 3600;
                break;
            case Unit.F:
                if (originVal < -273 || originVal > 102) {
                    return message.error('输入温度范围为 -273℉ ~ 102℉');
                }
                evolutionVal = origin.length === 0 ? 0 : findSuitVal(originVal - 273) * weight / 3600;
                break;
        }
        setEvolution(evolutionVal);
    };

    const reset = () => {
        setOrigin('');
        setOriginUnit(originOptions[0].value);
        setEvolution(0);
        setWeight(1);
    }

    return (
        <>
            <Row>
                <Col span={24}>
                    <h4>能量单位转换工具</h4>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Space.Compact size='large'>
                        <Input
                            placeholder='请输入待转换的值'
                            value={origin}
                            onChange={originChange}
                        />
                        <Select
                            style={{width: 340}}
                            placeholder={'请选择待转换的单位'}
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
                    </Space.Compact>
                </Col>
            </Row>
            {
                (originUnit === Unit.C || originUnit === Unit.F) && (
                    <Row style={{marginTop: 20}}>
                        <Input
                            style={{width: 220}}
                            size='large'
                            addonAfter="Kg"
                            value={weight}
                            onChange={handleWeightChange}
                        />
                        <Tooltip title="默认转换为 1Kg 水蒸汽的能量">
                            <QuestionCircleOutlined
                                style={{marginTop: 12, marginLeft: 10}}
                            />
                        </Tooltip>
                    </Row>
                )
            }
            <Row style={{marginTop: 20}}>
                <Statistic
                    title='电量（KWh）'
                    value={evolution}
                />
            </Row>
            <Row style={{marginTop: 20}}>
                <Button
                    type='primary'
                    onClick={convert}
                    size='middle'
                    icon={<SwapOutlined />}
                >转换</Button>
                <Button
                    onClick={reset}
                    size='middle'
                    icon={<RedoOutlined />}
                    style={{ marginLeft: 20 }}
                >重置</Button>
            </Row>
            <Row style={{marginTop: 20}}>
                <Col span={24}>
                    <h4>蒸汽表</h4>
                </Col>
            </Row>
            <Row>
                <Table
                    columns={columns}
                    dataSource={StreamData}
                    bordered
                />
            </Row>
        </>
    );
}

export default Conversion;

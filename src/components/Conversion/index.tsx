import React, {useState} from 'react';
import {Col, Row, Input, Select, Button} from 'antd';

enum Unit {
    J = 'J',
    KJ = 'KJ',
    MJ = 'MJ',
    GJ = 'GJ',
    DEGREE = 'DEGREE',
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
    text: '温度（℃）',
    value: Unit.DEGREE
}];

const evolutionOptions = [{
    text: '千瓦时（KWh）',
    value: Unit.KWh
}];

const Conversion = () => {
    const [origin, setOrigin] = useState('');
    const [btnDisabled, setBtnDisabled] = useState(true);
    const [originUnit, setOriginUnit] = useState(originOptions[0].value);
    const [evolution, setEvolution] = useState('');

    const originChange = (e) => {
        const val = e.target.value;
        if (val?.length) {
            setBtnDisabled(false);
        }
        setOrigin(val);
    };

    const onOriginUnitChange = (val) => {
        setEvolution('');
        setOriginUnit(val);
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
            case Unit.DEGREE:
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
            <Row>
                <Col span={10}>
                    <Select
                        style={{width: 220}}
                        placeholder={'请选择要转换的单位'}
                        size='large'
                        showSearch
                        optionFilterProp="children"
                        value={originUnit}
                        onChange={onOriginUnitChange}
                        filterOption={(input, option) =>
                          (option?.text ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                    >
                        {
                            originOptions.map(option => (
                                <Select.Option value={option.value} key={option.value}>
                                    {option.text}
                                </Select.Option>
                            ))
                        }
                    </Select>
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

import React, { useEffect } from 'react'
//import { FaCode } from "react-icons/fa";
import { Card, Icon, Avatar, Col, Typography, Row } from 'antd';
import Axios from 'axios';
const { Title } = Typography
//const { Meta } = Card;

function LandingPage() {

    

    useEffect(() => {

        Axios.get('/api/video/getVideos')
        .then(response => {
            if(response.data.success) {
                console.log(response.data)
            }else {
                alert('비디오 가져오기를 실패했습니다.')
            }
        })

    }, []) /* [] -> 비어있으면 한번만 function을 실행한다. */

    //const renderCards =

    return (
        <div style={{ width: '85%', margin: '3rem auto' }}>
            <Title level={2}> Recommended </Title>
            <hr />
            <Row gutter={[32, 16]}>
                
                {/* {renderCards}
                <Col lg={6} md={8} xs={24}>
                    <div style={{ position:'relative' }}>
                        <div className="duration">

                        </div>
                    </div>
                <br />
                <Meta
                    description=""
                />
                </Col> */}

            </Row>
        </div>
    )
}

export default LandingPage

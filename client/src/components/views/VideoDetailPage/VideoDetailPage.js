import React, { useEffect, useState } from 'react';
import { Row, Col, List, Avatar } from 'antd';
import Axios from 'axios';
import SideVideo from './Sections/SideVideo';
import Subscribe from './Sections/Subscribe';
import Comment from './Sections/Comment';
//import { Video } from '../../../../../server/models/Video';

function VideoDetailPage(props) {

    const videoId = props.match.params.videoId // url을 통해 videoId를 가져옴
    const variable = { videoId: videoId}

    const [VideoDetail, setVideoDetail] = useState([])
    const [Comments, setComments] = useState([])

    useEffect(() => {
        
        // 해당 비디오 정보 가져오기
        Axios.post('/api/video/getVideoDetail', variable)
            .then(response => {
                if(response.data.success) {
                    //console.log(response.data)
                    setVideoDetail(response.data.videoDetail)
                }else {
                    alert('비디오 정보를 가져오는데 실패하였습니다.')
                }
            })

        // 해당 비디오의 모든 댓글 가져오기
        Axios.post('/api/comment/getComments', variable)
            .then(response => {
                if(response.data.success) {
                    //console.log(response.data.comments)
                    setComments(response.data.comments)
                }else {
                    alert('코멘트 정보를 가져오는데 실패하였습니다.')
                }
            })
        
    }, [])


    // 저장한 댓글을 댓글목록에 바로 뿌려주기
    const refreshFunction= (newComment) => {
        setComments(Comments.concat(newComment)) // 기존댓글들에 새댓글 추가
    }

    if(VideoDetail.writer){

        // 해당 영상 업로드 userId가 로그인 userId와 같지않으면
        const subscribeButton = localStorage.getItem('userId') !== VideoDetail.writer._id && <Subscribe userTo={VideoDetail.writer._id} userFrom={localStorage.getItem('userId')} /> 
        return (
            <Row guttur={[16, 16]}>
                <Col lg={18} xs={24}>
                    
                    <div style={{ width: '100%', padding:'3rem 4rem' }}>
                        <video style={{ width: '100%' }} src={`http://localhost:5000/${VideoDetail.filePath}`} controls />
    
                            <List.Item 
                            actions={[subscribeButton]} // true이면 userTo, userFrom => Subscribe 컴포넌트로 props를 보냄
                            >
                        
                            
                        
                        
                            <List.Item.Meta
                                avatar={<Avatar src={VideoDetail.writer.image} />}
                                title={VideoDetail.writer.name}
                                description={VideoDetail.description}
                            />
                        </List.Item>

                        {/* Comments 컴포넌트 */}
                        <Comment refreshFunction={refreshFunction} commentLists={Comments} videoId={VideoDetail._id} />
                    </div>
    
                </Col>
                <Col lg={6} xs={24} >
                    {/* SideVideo 컴포넌트 */}
                    <SideVideo /> 
                </Col>
            </Row>
        )
    }else {
        return (
            <div>Loading...</div>
        )
    }
}
    

export default VideoDetailPage
import Axios from 'axios'
import React , {useState} from 'react'
import { Comment, Avatar, Button, Input } from 'antd';
import { useSelector } from 'react-redux'

const { TextArea } = Input; 

function SingleComment(props) {

    const user = useSelector(state => state.user) // redux hook을 통한 user 정보 가져오기

    const [OpenReply, setOpenReply] = useState(false); // 댓글 form 접었다 펴기 관련
    const [CommentValue, setCommentValue] = useState(); // 댓글코멘트 값 세팅
    
    const onClickReplyOpen = () => {
        setOpenReply(!OpenReply)
    }
    // function onClickReplyOpen() {
    //     setOpenReply(!OpenReply)
    // }

    const onhandleChange = (event) => {
        setCommentValue(event.currentTarget.value)
    }

    const onSubmit = (event) => {
        event.preventDefault();

        const variables = {
            content: CommentValue,
            writer: user.userData._id,
            postId: props.postId, // 해당 videoId
            responseTo: props.comment._id// 해당 댓글 id
        }

        Axios.post('/api/comment/saveComment', variables)
            .then(response => {
                if(response.data.success){
                    console.log(response.data.result)
                    setCommentValue("")
                    // 저장한 댓글을 댓글목록에 바로 뿌려주기
                    props.refreshFunction(response.data.result) // 저장한 comment를 refreshFunction으로 보내줌
                }else{
                    alert('코멘트를 저장을 실패하였습니다.')
                }
            })
    }
    

    const actions = [
        <span onClick={onClickReplyOpen} key="comment-basic-reply-to">Reply to</span>
    ]
        
    return (
        <div>
            <Comment
                actions={actions} // reply(답글) 관련
                author={props.comment.writer.name} // 댓글 작성자
                avatar={<Avatar src={props.comment.writer.image} alt="true" />} // 댓글 작성자 프로필
                content={ <p> {props.comment.content} </p> } // 댓글 작성자의 comment
            />

            {/* OpenReply가 true 일때 댓글Comment 보이기 */}
            {OpenReply && 
                <form style={{ display:'flex' }} onSubmit={onSubmit} >
                    <textarea 
                        style={{ width: '100%', borderRadius: '5px' }}
                        onChange={onhandleChange}
                        value={CommentValue}
                        placeholder='코멘트를 작성해주세요.'
                    />
                    <br />
                    <button style={{ width: '20%', height: '52px' }} onClick={onSubmit} >Submit</button>
                </form>
            }
            
        </div>
    )
    }

export default SingleComment
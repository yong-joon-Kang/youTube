import Axios from 'axios'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import SingleComment from './SingleComment'

function Comment(props) {

    const user = useSelector(state => state.user) // redux hook을 통한 user 정보 가져오기

    const videoId = props.videoId

    const [commentValue, setcommentValue] = useState("")

    const handleClick = (event) => {
        setcommentValue(event.currentTarget.value)
    }

    const onSubmit = (event) => {
        event.preventDefault();

        const variables = {
            content: commentValue,
            writer: user.userData._id,
            postId: videoId
        }

        Axios.post('/api/comment/saveComment', variables)
            .then(response => {
                if(response.data.success){
                    console.log(response.data.result)
                    setcommentValue("")
                    // 저장한 댓글을 댓글목록에 바로 뿌려주기
                    props.refreshFunction(response.data.result) // 저장한 comment를 refreshFunction으로 보내줌
                }else{
                    alert('코멘트를 저장을 실패하였습니다.')
                }
            })
    }


    return (
        <div>
            <br />
            <p>Replies</p>
            <hr />

            {/* Comment Lists */}

            {props.commentLists && props.commentLists.map(( comment, index )=> ( // 모든 댓글(commentLists 배열)에 대해 SingleComment 컴포넌트에서 ui를 구성한다.

                (!comment.responseTo && // root 댓글이면
                <SingleComment key={comment._id} refreshFunction={props.refreshFunction} comment={comment} postId={props.videoId} /> )
                
            ))} 
                

            {/* Root Comment Form */}
            <form style={{ display:'flex' }} onSubmit={onSubmit} >
                <textarea 
                    style={{ width: '100%', borderRadius: '5px' }}
                    onChange={handleClick}
                    value={commentValue}
                    placeholder='코멘트를 작성해주세요.'
                />
                <br />
                <button style={{ width: '20%', height: '52px' }} onClick={onSubmit} >Submit</button>
            </form>
        </div>
    )
}

export default Comment
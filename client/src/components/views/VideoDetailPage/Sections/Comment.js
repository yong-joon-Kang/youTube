import Axios from 'axios'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'

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
                }else{
                    alert('코멘트를 저장을 실패하였습니다.')
                }
            })
    }

    return (
        <div>
            <br />
            <p>Replies</p>
            <br />

            {/* Comment Lists */}

            {/* Root Comment Form */}

            <form style={{ display:'flex' }} onSubmit={onSubmit} >
                <textarea 
                    style={{ width: '100%', borderRadius: '5px' }}
                    onChange={handleClick}
                    value={commentValue}
                    placeholder='코멘트'
                />
                <br />
                <button style={{ width: '20%', height: '52px' }} onClick={onSubmit} >Submit</button>
            </form>
        </div>
    )
}

export default Comment
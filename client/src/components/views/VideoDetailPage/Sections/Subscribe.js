import React, { useState, useEffect } from 'react'
import Axios from 'axios'


function Subscribe(props) {
    
    const [SubscribeNumber, setSubscribeNumber] = useState(0)
    const [Subscribed, setSubscribed] = useState(false)

    useEffect(() => {
        console.log(props.userTo, props.userFrom)
        // 해당 영상 작성자의 구독자 수 정보 받아오기.
        const subscribeNumberVariables = { userTo: props.userTo } // props.userTo = writer._id
        Axios.post('/api/subscribe/subscribeNumber', subscribeNumberVariables)
            .then(response => {
                if (response.data.success) {
                    setSubscribeNumber(response.data.subscribeNumber)
                } else {
                    alert('구독자 수 정보를 받아오지 못했습니다.')
                }
            })

        // 접속자가 해당 영상 작성자를 구독했는지에 대한 여부
        const subscribedVariable = { userTo: props.userTo, userFrom: localStorage.getItem('userId') } // props.userTo = writer._id, userFrom = 접속자Id(Login하면 localStorage에 userId가 담겨있음)
        Axios.post('/api/subscribe/subscribed', subscribedVariable)
            .then(response => {
                if (response.data.success) {
                    setSubscribed(response.data.subscribed)
                } else {
                    alert('구독 여부에 대한 정보를 받아오지 못했습니다.')
                }
            })


    }, [])

    const onSubscribe = () => {

        let subscribedVariable = {
            userTo : props.userTo, // 영상 업로드 userID (작성자)
            userFrom : props.userFrom  // 로그인 userId
        }
        
        if(Subscribed){ // 이미 구독중이면
            
            Axios.post('/api/subscribe/unSubscribe', subscribedVariable)
                .then(response => {
                    if(response.data.success){
                        setSubscribeNumber(SubscribeNumber - 1)
                        setSubscribed(!Subscribed)
                    }else{
                        alert('구독 취소를 실패하였습니다.')
                    }
            })
        
        }else{ // 구독중이 아니면
            console.log('구독하기')
            Axios.post('/api/subscribe/subscribe', subscribedVariable)
                .then(response => {
                    if(response.data.success){
                        setSubscribeNumber(SubscribeNumber + 1)
                        setSubscribed(!Subscribed)
                    }else{
                        alert('구독을 실패하였습니다.')
                    }
            })
        }
    }

    return (
        <div>
            <button 
                style={{
                    backgroundColor: `${Subscribed ? '#AAAAAA' : '#CC0000'}`,
                    borderRadius: '4px', color: 'white', border: 'none',
                    padding: '10px 16px', fontWeight: '500', fontSize: '1rem', textTransform: 'uppercase'
                }}
                onClick={onSubscribe}
            >
                {SubscribeNumber} {Subscribed ? '구독중' : '구독'}
            </button>
        </div>
    )
    }

export default Subscribe
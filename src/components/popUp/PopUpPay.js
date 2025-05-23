import React from 'react';
import { Modal, Button } from 'antd';
import axios from 'axios';
import MusicNote from '../../assets/MusicNote';
import './PopUpPay.css';
import { CloseCircleOutlined } from '@ant-design/icons';
import gif_party1 from '../../assets/gif_party1.webp';
import { loadStripe } from '@stripe/stripe-js';


const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
const urlServer = process.env.REACT_APP_URL_SERVER;





function PopUpPay({ isVisible, onClose }) {
    const accessToken = localStorage.getItem('access_token');;
    

    const redirectToCheckout = async (priceId) => {
        console.log('priceId', priceId);
        const stripe = await stripePromise;
        
        const { data } = await axios.post(`${urlServer}/create-checkout-session`, {
            priceId: priceId,
            accessToken: accessToken,
            purchaseType: 'UNLIMITED_PASS',
        });
        const result = await stripe.redirectToCheckout({ sessionId: data.sessionId });
    
        console.log(result);
    
        if (result.error) {
            console.error(result.error.message);
        }
    };


    

    return (
        <Modal
            className="pop-up-pay"
            title={<div className="modal-title-pay">


                <MusicNote />
                <span className="modal-title-text-pay">Don't stop the party...</span>
                <div className='close-icon-container-pay' onClick={onClose}>
                    <CloseCircleOutlined className="close-icon-pay" /></div>
            </div>
            }
            open={isVisible}
            onCancel={onClose}
            footer={null}
            closable={false}
        >
            <div className="content-container-pay">
                <div className="text-container-pay" style={{ textAlign: 'center' }}>
                    <p>You have reached your daily limit of 5 free games.</p>
                    <p>Grab a pass to get <b>unlimited quizzes for life.</b></p>
                </div>
                <img className='gif-container-pay' alt='gif-party' src={gif_party1}  />
                <Button autoFocus className="hr24-button-pay" onClick={() => redirectToCheckout(process.env.REACT_APP_UNLIMITED_PASS_PRICE_ID)} >
                    Unlimited pass - $9.99
                </Button>
                <div className="text-container-pay-bottom" >
                    <p>Available only for the first 20 customers.</p>
                 
                    </div>
                
            </div>

        </Modal>
    );
}

export default PopUpPay;
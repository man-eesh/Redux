import React, { useState, useEffect } from 'react';
import { useStateValue } from "../StateProvider/StateProvider";
import { Link, useHistory } from "react-router-dom";
import Checkout from "../CheckoutProduct/CheckoutProduct";
import "./Payment.css";
import CurrencyFormat from "react-currency-format";
import { getBasketTotal } from "./../Reducer/Reducer";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import axios from "./../axios";
function Payment() {
    const [{ basket, user }, dispatch] = useStateValue();
    const history = useHistory();

    const stripe = useStripe();
    const elements = useElements();

    const [error, setError] = useState(null);
    const [disabled, setDisabled] = useState(true);
    const [succeded, setSucceeded] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [clientSecret, setClientSecret] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);

        const payload = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement)
            }
        }).then(({ paymentIntent }) => {
            setSucceeded(true);
            setProcessing(false);
            setError(null);
            history.replace("/orders");
        })
    }
    const handleChange = event => {
        setDisabled(event.empty);
        setError(event.error ? event.error.message : "");
    }
    useEffect(() => {
        const getClientSecret = async () => {
            const response = await axios({
                method: 'post',
                // stripe needs currency subunits - hence * 100
                url: `/payments/create?total=${getBasketTotal(basket) * 100}`
            })
            setClientSecret(response.data.clientSecret);
        }
        getClientSecret();
    }, [basket])
    return (
        <div className="payment">
            <div className="payment__container">
                <h1>
                    Checkout (<Link to="/checkout">{basket ?.length} items </Link>)
                </h1>
                <div className="payment__section">
                    <div className="payment__title">
                        <h3>Delivery Address</h3>
                    </div>
                    <div className="payment__address">
                        <p>{user ?.email}</p>
                        <p>taliparamba</p>
                        <p>Kannur</p>
                    </div>
                </div>
                <div className="payment__section">
                    <div className="payment__title">
                        <h3>Review Items and Delivery</h3>
                    </div>
                    <div className="payment__items">
                        {basket.map(item => (
                            <Checkout
                                id={item.id}
                                title={item.title}
                                image={item.image}
                                price={item.price}
                                rating={item.rating}
                            />
                        ))}

                    </div>
                </div>
                <div className="payment__section">
                    <div className="payment__title">
                        <h3>Payment Method</h3>
                    </div>
                    <div className="payment__details">
                        <form onSubmit={handleSubmit}>
                            <CardElement onChange={handleChange} />
                        </form>
                        <div className="payment__priceContainer">
                            <CurrencyFormat
                                renderText={(value) => (
                                    <>
                                        <p>
                                            {/* Part of the homework */}
                                            Order Total ({basket.length} items): <strong>{value}</strong>
                                        </p>
                                        <small className="subtotal__gift">
                                            <input type="checkbox" /> This order contains a gift
                                        </small>
                                    </>
                                )}
                                decimalScale={2}
                                value={getBasketTotal(basket)} // Part of the homework
                                displayType={"text"}
                                thousandSeparator={true}
                                prefix={"$"}
                            />
                            <button disabled={processing || succeded || disabled}>
                                <span>
                                    {processing ? <p>Processing</p> : <p>Buy Now</p>}
                                </span>
                            </button>
                            {error && <div>{error}</div>}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Payment

import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set } from 'firebase/database';
import {useState, useRef} from "react";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAv-37UMUiZFTwDwpvS1XHKCAroyFQfKbE",
  authDomain: "otp-proj-13july24.firebaseapp.com",
  databaseURL: "https://otp-proj-13july24-default-rtdb.firebaseio.com",
  projectId: "otp-proj-13july24",
  storageBucket: "otp-proj-13july24.appspot.com",
  messagingSenderId: "649606329481",
  appId: "1:649606329481:web:ae3175db7d3c6cdedd8258"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = getDatabase(app);


function Enquiry() {
    const rName = useRef();
    const rEmail = useRef();
    const rPhone = useRef();
    const rQuery = useRef();
    const rOtp = useRef();

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [query, setQuery] = useState("");
    const [otp, setOtp] = useState("");
    const [msg, setMsg] = useState("");
    const [final, setFinal] = useState(null);

    const hName = (event) => {
        setName(event.target.value);
    };
    const hPhone = (event) => {
        setPhone(event.target.value);
    };
    const hEmail = (event) => {
        setEmail(event.target.value);
    };
    const hQuery = (event) => {
        setQuery(event.target.value);
    };
    const hOtp = (event) => {
        setOtp(event.target.value);
    };

    const configureCaptcha = () => {
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
            'size': 'invisible',
            'callback': (response) => {
                sendOtp();
                console.log("Recaptcha verified");
            },
            'defaultCountry': "IN"
        });
    };

    const sendOtp = (event) => {
        event.preventDefault();
        configureCaptcha();
        let pn = "+91" + phone;
        let av = window.recaptchaVerifier;
        firebase.auth().signInWithPhoneNumber(pn, av)
            .then(res => {
                setFinal(res);
                console.log(res);
                console.log("OTP sent");
                alert(`OTP sent successfully to ,${name}`);
            })
            .catch(err => console.log(err));
    };

    const submitOtp = (event) => {
        event.preventDefault();
            final.confirm(otp)
                .then(res => {
                    const d = new Date().toString();
                    const n = name + "-->" + d;
                    const data = { name, phone, query, date: d };

                    set(ref(db, "visitors/" + n), data)
                        .then(res => {
                            console.log(res);
                            alert(`Thank you, ${name}, for contacting us. We will get back to you.`);
                            window.location.reload();
                        })
                        .catch(err => {
                            console.error(err);
                            alert("There was an error submitting your query. Please try again later.");
                            window.location.reload();
                        });
                })
                .catch(err => {
                    console.error("OTP confirmation failed:", err);
                    alert("OTP confirmation failed. Please check the OTP and try again.");
                });
       
    };

    return (
        <>
            <center>
            <h1>Customer Enquiry Form</h1>
            <h3>We will analyze your enquiry and return to you shortly.</h3>
            <div className="form">
                <div id='form'>
                    <form onSubmit={sendOtp}>
                        <input type="text" placeholder="Enter your name" onChange={hName} ref={rName} value={name} />
                        <br /><br />
                        <input type="email" placeholder="Enter your email" onChange={hEmail} ref={rEmail} value={email} />
                        <br /><br />
                        <input type="tel" placeholder="Enter Phone number" onChange={hPhone} ref={rPhone} value={phone} />
                        <br /><br />
                        <textarea placeholder="Query" rows={3} cols={30} onChange={hQuery} ref={rQuery} value={query} />
                        <br /><br />
                        <input type="submit" value="Generate OTP" id="sign-in-button" />
                        <br /><br />
                    </form>
                    <form onSubmit={submitOtp}>
                        <input type="number" placeholder="Enter OTP" onChange={hOtp} ref={rOtp} value={otp} />
                        <br /><br />
                        <input type="submit" value="Submit OTP" />
                    </form>
                </div>
            </div>
            <h2 id="msg">{msg}</h2>
        </center>
            
        </>
    );
}

export default Enquiry;

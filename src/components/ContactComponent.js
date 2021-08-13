import React, { useEffect } from 'react';
import '../styles/Contact.css';
import { NavbarComponent } from './NavbarComponent';

export function ContactComponent() {
    useEffect(() => {
        if (localStorage.submissionTimestamp) {
            if (Date.now() - localStorage.submissionTimestamp < 600000) {
                document.getElementById('submit').classList.add('disabled')
                document.getElementById("result-text").innerText = `Please allow 10 minutes before submitting another message.`;
            }
        }

        const form = document.querySelector("form");
        form.addEventListener("submit", (event) => {
            // prevent the form submit from refreshing the page
            event.preventDefault();

            const { name, email, message, codeword } = event.target;
            //console.log(name.value, email.value, message.value, codeword.value)
            if (codeword.value.length !== 0 || Date.now() - localStorage.submissionTimestamp < 600000) {
                console.log('submission not accepted')
                return false;
            }
            // Use your API endpoint URL you copied from the previous step
            const endpoint = "https://9zab8tlvq1.execute-api.us-east-2.amazonaws.com/sendContactEmail";
            // We use JSON.stringify here so the data can be sent as a string via HTTP
            const body = JSON.stringify({
                senderName: name.value,
                senderEmail: email.value,
                message: message.value,
            });
            const requestOptions = {
                method: "POST",
                body
            };

            fetch(endpoint, requestOptions)
                .then((response) => {
                    console.log('Response:')
                    console.log(response)
                    if (!response.ok) throw new Error("Error in fetch");
                    return response.json();
                })
                .then((response) => {
                    document.getElementById("result-text").innerText = `Message sent successfully. Thank you!`;
                    document.getElementById("submit").classList.add('disabled')
                    document.getElementById("namebox").setAttribute('disabled', true)
                    document.getElementById("emailbox").setAttribute('disabled', true)
                    document.getElementById("messagebox").value = ""
                    localStorage.setItem('submissionTimestamp', Date.now())
                })
                .catch((error) => {
                    console.log('Error:')
                    console.log(error)
                    document.getElementById("result-text").innerText = "An unknown error occured.";
                });
        });
    }, []);

    return (
        <div className="App">
            <NavbarComponent />
            <div id="contact-form">
                <h2>Contact Self Serving Skillet</h2>
                <form id="form-content">
                    <div id="identity">
                        <div id="name-in">
                            <label htmlFor="name">Name:</label><br />
                            <input id="namebox" name="name" type="text" required autoFocus placeholder="Name (required)" /><br /><br />
                        </div>
                        <div id="email-in">
                            <label htmlFor="email">Email:</label><br />
                            <input id="emailbox" name="email" type="email" required placeholder="Email (required)" /><br /><br />
                        </div>
                    </div>
                    <label htmlFor="codeword" id="codelabel">Name:</label><br />
                    <input id="codeinput" name="codeword" type="text" placeholder="Code (required)" />
                    <label htmlFor="name">Message:</label><br />
                    <textarea id="messagebox" name="message" required minLength="20" maxLength="1000" rows="4" spellCheck={true} placeholder="Your message..." ></textarea><br /><br />
                    <div id="submit-btn">
                        <input id="submit" type="submit" />
                        <p id="result-text"></p>
                    </div>
                </form>
            </div>
        </div>
    )
}
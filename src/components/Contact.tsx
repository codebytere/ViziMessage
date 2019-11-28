import React from "react";

function Contact(props: any) {
  return (
    <div className="contact">
      <span>{props.first} {props.last}</span>
    </div>
  );
}

export default Contact;
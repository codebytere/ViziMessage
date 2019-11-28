import React from "react";
import Contact from "./Contact";

function ContactList(props: any) {
  return (
    <div>
      {props.contacts.map((c: any) => {
        return <Contact key={c.id} first={c.firstName} last={c.lastName} />
      })}
    </div> 
  );
}

export default ContactList;
import React from "react";
import PropTypes from "prop-types";
import "./ListConversation.css";
import { Input } from "@mantine/core";

ListConversation.propTypes = {};
function ListConversation(props) {
  return (
    <div>
      <div></div>
      <Input
        classNames={{
          input: "ListConversation-search-input",
        }}
        placeholder="Your email"
      />
    </div>
  );
}

export default ListConversation;

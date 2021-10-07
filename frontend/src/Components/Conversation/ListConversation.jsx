import React from "react";
import PropTypes from "prop-types";
import "./ListConversation.css";
import { Input } from "@mantine/core";
import { IoMdSearch } from "react-icons/io";
import ListConversationDetail from "./ListConversationDetail";

ListConversation.propTypes = {
  conversationList: PropTypes.array,
  currentUserId: PropTypes.string,
};

function ListConversation(props) {
  //PROP
  const { conversationList, currentUserId } = props;
  //STATE
  return (
    <>
      <div className="ListConversation-search-input">
        <Input icon={<IoMdSearch />} placeholder="Search" radius="xl" />
      </div>
      <div style={{ width: 260, marginTop: 20 }}>
        <p style={{ fontSize: 15, fontWeight: 600, color: "#6E85AD" }}>Last contact</p>
      </div>
      <div className="ListConversation-item-div">
        {conversationList?.map((item) => (
          <ListConversationDetail item={item} currentUserId={currentUserId} key={item.id} />
        ))}
      </div>
    </>
  );
}

export default ListConversation;

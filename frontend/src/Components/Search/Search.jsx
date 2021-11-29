// import React, { useState, useEffect } from "react";
// import "./Search.css";
// import { Select } from "@mantine/core";
// import { MdOutlinePriceChange } from "react-icons/md";
// import { MdDateRange } from "react-icons/md";
// import { GoTag } from "react-icons/go";
// import { Input } from "@mantine/core";
// import { BiSearchAlt } from "react-icons/bi";
// function Search(props) {
//   //STATE
//   const [tab, setTab] = useState(["Post", "Auction", "User"]);
//   const [tabLine, setTabLine] = useState("All");
//   const [priceFilter, setPriceFilter] = useState([
//     { value: "None", label: "None" },
//     { value: "Increase", label: "Increase" },
//     { value: "Decrease", label: "Decrease" },
//   ]);
//   const [datetimeFilter, setDatetimeFilter] = useState([
//     { value: "None", label: "None" },
//     { value: "Increase", label: "Increase" },
//     { value: "Decrease", label: "Decrease" },
//   ]);
//   const [categoryFilter, setCategoryFilter] = useState([
//     { value: "None", label: "None" },
//     { value: "Increase", label: "Increase" },
//     { value: "Decrease", label: "Decrease" },
//   ]);

//   // VARIABLE
//   const tabBorderBottom = "3px solid greenyellow";
//   return (
//     <div className="Search-component">
//       <div className="Search-main">
//         <div className="Search-leftPart">
//           <div className="Search-leftPart-tab">
//             <div
//               className="Search-leftPart-tab-item"
//               style={{ borderBottom: tabLine === "All" ? tabBorderBottom : "" }}
//               onClick={() => {
//                 setTab(["Post", "Auction", "User"]);
//                 setTabLine("All");
//               }}
//             >
//               <p>All</p>
//             </div>
//             <div
//               style={{ borderBottom: tabLine === "Post" ? tabBorderBottom : "" }}
//               className="Search-leftPart-tab-item"
//               onClick={() => {
//                 setTab(["Post"]);
//                 setTabLine("Post");
//               }}
//             >
//               <p>Posts</p>
//             </div>
//             <div
//               style={{ borderBottom: tabLine === "Auction" ? tabBorderBottom : "" }}
//               className="Search-leftPart-tab-item"
//               onClick={() => {
//                 setTab(["Auction"]);
//                 setTabLine("Auction");
//               }}
//             >
//               <p>Auctions</p>
//             </div>
//             <div
//               style={{ borderBottom: tabLine === "User" ? tabBorderBottom : "" }}
//               className="Search-leftPart-tab-item"
//               onClick={() => {
//                 setTab(["User"]);
//                 setTabLine("User");
//               }}
//             >
//               <p>Users</p>
//             </div>
//           </div>
//           <div className="Search-leftPart-filter">
//             <p style={{ fontSize: 16, fontWeight: 550, color: "#98a6be" }}>Filter</p>
//             <div style={{ display: "flex" }}>
//               <div className="Search-leftPart-func">
//                 <div className="Search-leftPart-item">
//                   <Select
//                     placeholder="Price sort"
//                     icon={<MdOutlinePriceChange />}
//                     data={priceFilter}
//                   />
//                 </div>
//                 <div className="Search-leftPart-item">
//                   <Select
//                     placeholder="Datetime sort"
//                     icon={<MdDateRange />}
//                     data={datetimeFilter}
//                   />
//                 </div>
//                 <div className="Search-leftPart-item">
//                   <Select placeholder="Category" icon={<GoTag />} data={categoryFilter} />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="Search-rightPart">
//           <div className="Search-rightPart-search">
//             <Input placeholder="Search" radius="md" rightSection={<BiSearchAlt />} />
//           </div>
//           <div className="Search-rightPart-div">
//             <p>Result for: </p>
//             <p>Price sort: </p>
//             <p>Datetime sort: </p>
//             <p>Category: </p>
//           </div>
//         </div>
//       </div>
//       <div className="Search-info">
//         {tab.some((item) => item === "Post") && (
//           <div className="Search-info-post">
//             {/*new product*/}
//             <div
//               style={{
//                 width: "100%",
//                 marginTop: "20px",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//               }}
//             >
//               <div className="new-product-div">
//                 <div className="new-product-title">NEW PRODUCT</div>
//                 <div className="new-product-item-div">
//                   {allPost.length ? (
//                     <Grid gutter={10} columns={25} style={{ margin: 0 }}>
//                       {allPost?.map((item) => (
//                         <div key={item.id}>
//                           <Col style={{ display: "flex", justifyContent: "center" }} span={5}>
//                             <div className="new-product-card">
//                               <div className="new-product-card-content">
//                                 <img src={item.imageUrl[0]} alt="Product"></img>
//                                 <LinesEllipsis
//                                   className="new-product-card-content-ellipsis"
//                                   text={item.productName}
//                                   maxLine="2"
//                                   ellipsis="..."
//                                   trimRight
//                                   basedOn="letters"
//                                 />
//                                 <div className="new-product-card-content-bottom">
//                                   <p style={{ fontSize: 20, fontWeight: 560 }}>
//                                     {new Intl.NumberFormat("vi", {
//                                       style: "currency",
//                                       currency: "VND",
//                                     })
//                                       .format(item.price)
//                                       .split("₫")}
//                                   </p>
//                                   <p style={{ fontSize: 15 }}>₫</p>
//                                 </div>
//                               </div>
//                               <div className="new-product-card-button">
//                                 <button
//                                   onClick={() => {
//                                     contact(item.id, "Post");
//                                   }}
//                                 >
//                                   Contact
//                                 </button>
//                                 <button
//                                   onClick={() => {
//                                     detail(item.id, "Post");
//                                   }}
//                                 >
//                                   Detail
//                                 </button>
//                               </div>
//                             </div>
//                           </Col>
//                         </div>
//                       ))}
//                     </Grid>
//                   ) : (
//                     ""
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//         {tab.some((item) => item === "Auction") && (
//           <div className="Search-info-auction">Auction</div>
//         )}
//         {tab.some((item) => item === "User") && <div className="Search-info-user">User</div>}
//       </div>
//     </div>
//   );
// }

// export default Search;

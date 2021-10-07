const baseUrl = "http://localhost:3000";
const io = require("socket.io")(3002, {
  cors: {
    origin: baseUrl,
  },
});

//FUNCTION
//initial storage user
let users = [];

const addUser = (userId, socketId) => {
  const checkUser = users.find((item) => item.userId === userId);
  if (!checkUser) {
    users.push({ userId: userId, socketId: socketId });
  } else {
    users.slice(users.indexOf(checkUser), 1);
    users.push({ userId: userId, socketId: socketId });
  }
};

const getSocketId = (userId) => {
  const user = users.find((item) => item.userId === userId);
  if (!user) {
    return null;
  } else {
    return user.socketId;
  }
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

//SOCKET IO
io.on("connection", (socket) => {
  //Get userId and SocketId
  try {
    socket.on("addUser", (currentUserId) => {
      if (currentUserId != "" && !users.some((item) => item.userId === currentUserId)) {
        addUser(currentUserId, socket.id);
        console.log("addUser success");
      }
      console.log(users);
    });
  } catch (error) {
    console.log(error);
  }

  try {
    //send and receive messages
    socket.on("sendMessage", (partnerId, message) => {
      const receiver = getSocketId(partnerId);
      if (receiver != null) {
        io.to(receiver).emit("getMessage", message);
      }
    });
  } catch (error) {}

  //disconnect
  socket.on("disconnect", () => {
    removeUser(socket.id);
    console.log(users);
    console.log("user disconnected");
  });
});

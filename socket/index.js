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
  } catch (error) {
    console.log(error);
  }

  //Join room
  try {
    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
    });
  } catch (error) {
    console.log(error);
  }

  //bidUpdate
  try {
    socket.on("bidValueUpdateSever", (data) => {
      io.to(data.roomId).emit("bidValueUpdateClient", data.currentValue);
    });
  } catch (error) {
    console.log(error);
  }

  //HistoryUpdate
  try {
    socket.on("historyUpdateSever", (data) => {
      io.to(data.roomId).emit("historyUpdateClient", data.arrayData);
    });
  } catch (error) {
    console.log(error);
  }

  //HistoryUpdateAll
  try {
    socket.on("historyUpdateAllSever", (data) => {
      io.to(data.roomId).emit("historyUpdateAllClient");
    });
  } catch (error) {
    console.log(error);
  }

  //disconnect
  socket.on("disconnect", () => {
    removeUser(socket.id);
    console.log("user disconnected");
  });
});

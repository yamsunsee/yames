class Player {
  private id: string;
  private name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }

  getName(): string {
    return this.name;
  }

  getId(): string {
    return this.id;
  }
}

class Room {
  private id: string;
  private players: Player[];

  constructor(id: string) {
    this.id = id;
    this.players = [];
  }

  getId(): string {
    return this.id;
  }

  addPlayer(
    playerId: string,
    playerName: string
  ): { isSuccess: boolean; room?: Room } {
    if (this.players.length < 2) {
      const newPlayer = new Player(playerId, playerName);
      this.players.push(newPlayer);

      return {
        isSuccess: true,
        room: this,
      };
    }

    return { isSuccess: false };
  }

  removePlayer(playerId: string): Room {
    this.players = this.players.filter((player) => player.getId() !== playerId);

    return this;
  }

  getPlayerById(playerId: string): Player | undefined {
    return this.players.find((player) => player.getId() === playerId);
  }
}

class Rooms {
  private rooms: { [roomId: string]: Room };

  constructor() {
    this.rooms = {};
  }

  getPlayerById(playerId: string): Player | undefined {
    for (const roomId in this.rooms) {
      const room = this.rooms[roomId];
      const player = room.getPlayerById(playerId);
      if (player) {
        return player;
      }
    }
    return undefined;
  }

  getRoomByPlayerId(playerId: string): Room | undefined {
    for (const roomId in this.rooms) {
      const room = this.rooms[roomId];
      const player = room.getPlayerById(playerId);
      if (player) {
        return room;
      }
    }
    return undefined;
  }

  addPlayerToRoom(
    roomId: string,
    playerId: string,
    playerName: string
  ): { isSuccess: boolean; room?: Room } {
    if (!this.rooms[roomId]) {
      this.rooms[roomId] = new Room(roomId);
    }
    const room = this.rooms[roomId];
    return room.addPlayer(playerId, playerName);
  }

  removePlayerFromRoom(playerId: string): {
    player?: Player;
    room?: Room;
  } {
    const player = this.getPlayerById(playerId);
    const room = this.getRoomByPlayerId(playerId);
    if (player && room) {
      const currentRoom = room.removePlayer(playerId);
      return { player, room: currentRoom };
    }
    return {};
  }
}

export default Rooms;

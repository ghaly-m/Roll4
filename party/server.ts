import type * as Party from "partykit/server";

export default class EncounterParty implements Party.Server {
  private state: string | null = null;

  constructor(readonly room: Party.Room) {}

  onConnect(conn: Party.Connection) {
    if (this.state) {
      conn.send(this.state);
    }
  }

  onMessage(message: string, sender: Party.Connection) {
    this.state = message;
    this.room.broadcast(message, [sender.id]);
  }
}

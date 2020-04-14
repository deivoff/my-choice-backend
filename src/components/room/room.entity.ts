
export enum RoomStatus {
  await,
  progress,
}

export class RoomInstance {
  public roomName: string = '';
  public status!: RoomStatus;

  constructor(roomName: string) {
    this.roomName = roomName;
    this.status = RoomStatus.await;
  }

  isAwait() {
    return this.status === RoomStatus.await;
  }

  gameStart() {
    this.status = RoomStatus.progress;
  }
}

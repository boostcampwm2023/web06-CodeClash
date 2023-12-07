export const TIME_LIMIT = 30000;
export const ITEM_CREATE_CYCLE = 60000;
export const NUM_OF_ROUNDS = 1;
export const LOBBY_ID = 'lobby';
export const MAX_LOBBY_CAPACITY = 1000;
export const DEFAULT_ROOM_NAME = '신나는 싱글 스레드 파티';
export const NUM_OF_ITEMS = 9;
export const MAX_ITEM_CAPACITY = 2;
export const SUCCESS_STATUS = 'success';
export const ITEM_DELAY = 5000;
export const ROOM_STATE = {
  WAITING: 'waiting',
  PLAYING: 'playing',
} as const;
export type RoomState = (typeof ROOM_STATE)[keyof typeof ROOM_STATE];
export const EVENT = {
  LOBBY_INFO: 'lobby_info',
  ROOM_INFO: 'room_info',
  ENTER_LOBBY: 'enter_lobby',
  EXIT_LOBBY: 'exit_lobby',
  ENTER_ROOM: 'enter_room',
  EXIT_ROOM: 'exit_room',
  CREATE_ROOM: 'create_room',
  CHAT: 'chat',
  DM: 'dm',
  READY: 'ready',
  KICK: 'kick',
  ITEM: 'item',
  EXIT_RESULT: 'exit_result',
  INVITE: 'invite',
};

import {
  getCurrentUser,
  getUserLikes,
  setUserLikes,
  ensureUserExists,
} from "./userStorage";

export type Command = {
  execute: () => void;
  undo: () => void;
};

function createLikeCommand(id: number, likes: Set<number>): Command {
  return {
    execute: () => likes.add(id),
    undo: () => likes.delete(id),
  };
}

function createUnlikeCommand(id: number, likes: Set<number>): Command {
  return {
    execute: () => likes.delete(id),
    undo: () => likes.add(id),
  };
}

export function createHistory() {
  let doneStack: Command[] = [];
  let undoneStack: Command[] = [];
  const likes = new Set<number>();
  let listeners: (() => void)[] = [];
  let currentUser: string | null = getCurrentUser();

  const notify = () => listeners.forEach((l) => l());

  const persist = () => {
    if (!currentUser) return;
    setUserLikes(currentUser, Array.from(likes));
  };

  const loadForUser = (user: string | null) => {
    doneStack = [];
    undoneStack = [];
    likes.clear();
    currentUser = user;
    if (!currentUser) {
      notify();
      return;
    }
    ensureUserExists(currentUser);
    const stored = getUserLikes(currentUser) || [];
    stored.forEach((id) => likes.add(id));
    notify();
  };

  const doCommand = (command: Command) => {
    command.execute();
    doneStack = [...doneStack, command];
    undoneStack = [];
    persist();
    notify();
  };

  const undo = () => {
    const command = doneStack.pop();
    if (command) {
      command.undo();
      undoneStack = [...undoneStack, command];
      persist();
      notify();
    }
  };

  const redo = () => {
    const command = undoneStack.pop();
    if (command) {
      command.execute();
      doneStack = [...doneStack, command];
      persist();
      notify();
    }
  };

  const like = (id: number) => doCommand(createLikeCommand(id, likes));
  const unlike = (id: number) => doCommand(createUnlikeCommand(id, likes));

  const subscribe = (listener: () => void) => {
    listeners.push(listener);
    listener();
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  };

  const setActiveUser = (user: string | null) => {
    loadForUser(user);
  };

  loadForUser(currentUser);

  return {
    like,
    unlike,
    undo,
    redo,
    getLikes: () => Array.from(likes),
    subscribe,
    setActiveUser
  };
}

export const likeHistory = createHistory();

export type User = { id: string; name: string; email: string };

export type UserListItemProps = {
  user: User;
  isEditing: boolean;
  onStartEdit: () => void;
  onStopEdit: () => void;
  isConfirmingDelete: boolean;
  onRequestDelete: () => void;
  onCancelDelete: () => void;
};


import React from 'react';
import MockRouterAdmin from '../MockRouterAdmin';

interface RouterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  gatewayIp: string;
}

export const RouterDialog: React.FC<RouterDialogProps> = ({
  isOpen,
  onClose,
  gatewayIp
}) => {
  if (!isOpen) return null;

  return (
    <MockRouterAdmin
      open={isOpen}
      onClose={onClose}
      gatewayIp={gatewayIp}
      isRealNetwork={false}
    />
  );
};

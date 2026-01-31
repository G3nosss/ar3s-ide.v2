// Board definitions for Arduino upload support
// Each board includes chip specs, bootloader protocol, and build configuration

export const BOARDS = [
  {
    id: 'uno',
    name: 'Arduino Uno',
    fqbn: 'arduino:avr:uno',
    chip: 'ATmega328P',
    bootloader: {
      protocol: 'stk500v1',
      baudRate: 115200,
      timeout: 5000,
      pageSize: 128,
      signature: [0x1E, 0x95, 0x0F]
    },
    description: 'Arduino Uno (ATmega328P)'
  },
  {
    id: 'nano',
    name: 'Arduino Nano',
    fqbn: 'arduino:avr:nano',
    chip: 'ATmega328P',
    bootloader: {
      protocol: 'stk500v1',
      baudRate: 57600,
      timeout: 5000,
      pageSize: 128,
      signature: [0x1E, 0x95, 0x0F]
    },
    description: 'Arduino Nano (ATmega328P)',
    note: 'Old bootloader uses 57600 baud. If upload fails, some clones may use 115200.'
  },
  {
    id: 'mega',
    name: 'Arduino Mega 2560',
    fqbn: 'arduino:avr:mega',
    chip: 'ATmega2560',
    bootloader: {
      protocol: 'stk500v2',
      baudRate: 115200,
      timeout: 5000,
      pageSize: 256,
      signature: [0x1E, 0x98, 0x01]
    },
    description: 'Arduino Mega 2560 (ATmega2560)'
  },
  {
    id: 'mark4',
    name: 'Mark 4',
    fqbn: 'arduino:avr:uno',
    chip: 'ATmega328P',
    bootloader: {
      protocol: 'stk500v1',
      baudRate: 115200,
      timeout: 5000,
      pageSize: 128,
      signature: [0x1E, 0x95, 0x0F]
    },
    custom: true,
    description: 'Custom ATmega328P board (Uno-compatible)',
    note: 'Custom board cloned from Arduino Uno. Same chip and bootloader.'
  }
];

// Helper to get board by ID
export function getBoardById(id) {
  return BOARDS.find(board => board.id === id);
}

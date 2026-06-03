/**
 * Workshop seat VPN details — synced from pod_checks/access/login.yaml (ws1 seats only).
 * VPN username is not stored here: the copied command uses $(whoami)ws (lab Ubuntu user: devnet).
 */

/** @type {{ id: string, seat: number, torqueId: string, vpnAddress: string, vpnPassword: string }[]} */
export const labSeats = [
  {
    id: 'devwks-2618-ws1-seat1',
    seat: 1,
    torqueId: '1DIkTooDX467',
    vpnAddress: 'devnetsandbox-usw1-reservation.cisco.com:20357',
    vpnPassword: 'i#jF#xs3A&38VxC',
  },
  {
    id: 'devwks-2618-ws1-seat2',
    seat: 2,
    torqueId: 'eQ8G21l0xujf',
    vpnAddress: 'devnetsandbox-usw1-reservation.cisco.com:20358',
    vpnPassword: 'k4^F7gQx*P6T',
  },
  {
    id: 'devwks-2618-ws1-seat3',
    seat: 3,
    torqueId: 'h7AQ2sPmaQsz',
    vpnAddress: 'devnetsandbox-usw1-reservation.cisco.com:20359',
    vpnPassword: '388RHZ&18wO$kSs!',
  },
  {
    id: 'devwks-2618-ws1-seat4',
    seat: 4,
    torqueId: 'hwYbLPXDExjW',
    vpnAddress: 'devnetsandbox-usw1-reservation.cisco.com:20373',
    vpnPassword: '&b5u%PKRQB9L4wq',
  },
  {
    id: 'devwks-2618-ws1-seat5',
    seat: 5,
    torqueId: 'UP9BYdMU0K8U',
    vpnAddress: 'devnetsandbox-usw1-reservation.cisco.com:20360',
    vpnPassword: '&6xeoW20$^0WP',
  },
  {
    id: 'devwks-2618-ws1-seat6',
    seat: 6,
    torqueId: 'txPGjcJzJJav',
    vpnAddress: 'devnetsandbox-usw1-reservation.cisco.com:20420',
    vpnPassword: '_yN2MJOi4*6_v',
  },
  {
    id: 'devwks-2618-ws1-seat7',
    seat: 7,
    torqueId: 'tFwSSYbz87KX',
    vpnAddress: 'devnetsandbox-usw1-reservation.cisco.com:20421',
    vpnPassword: 'SX8y5kWdu_9jL!_',
  },
  {
    id: 'devwks-2618-ws1-seat8',
    seat: 8,
    torqueId: '20jbKPpheU1J',
    vpnAddress: 'devnetsandbox-usw1-reservation.cisco.com:20205',
    vpnPassword: '*Cu&D69N3p!e',
  },
  {
    id: 'devwks-2618-ws1-seat9',
    seat: 9,
    torqueId: 'BwlcqPFIXY4F',
    vpnAddress: 'devnetsandbox-usw1-reservation.cisco.com:20417',
    vpnPassword: 'AC6No57bC$8Vk*1k',
  },
  {
    id: 'devwks-2618-ws1-seat10',
    seat: 10,
    torqueId: 'qgtvteW8rrra',
    vpnAddress: 'devnetsandbox-usw1-reservation.cisco.com:20414',
    vpnPassword: 'dNuI77F%Gb2_I&mt',
  },
  {
    id: 'devwks-2618-ws1-seat11',
    seat: 11,
    torqueId: 'wB72g9VKgsPf',
    vpnAddress: 'devnetsandbox-usw1-reservation.cisco.com:20415',
    vpnPassword: 'xL5&J6^HcGmlf9',
  },
  {
    id: 'devwks-2618-ws1-seat12',
    seat: 12,
    torqueId: 'QgupgmNvbRH9',
    vpnAddress: 'devnetsandbox-usw1-reservation.cisco.com:20408',
    vpnPassword: 'Xiwhu5%66T*JR',
  },
  {
    id: 'devwks-2618-ws1-seat13',
    seat: 13,
    torqueId: '1kl7FHmN3TDh',
    vpnAddress: 'devnetsandbox-usw1-reservation.cisco.com:20396',
    vpnPassword: '!#2f7BPlauoW$EW0',
  },
  {
    id: 'devwks-2618-ws1-seat14',
    seat: 14,
    torqueId: 'G25kLFxP6t8b',
    vpnAddress: 'devnetsandbox-usw1-reservation.cisco.com:20419',
    vpnPassword: 'b3cSh_NvQ$&G8a2',
  },
  {
    id: 'devwks-2618-ws1-seat15',
    seat: 15,
    torqueId: '2EKCdqdpHu8e',
    vpnAddress: 'devnetsandbox-usw1-reservation.cisco.com:20418',
    vpnPassword: '5IG!3Kk*itT*$u1',
  },
  {
    id: 'devwks-2618-ws1-seat16',
    seat: 16,
    torqueId: 'x4WCJqwPISt8',
    vpnAddress: 'devnetsandbox-usw1-reservation.cisco.com:20416',
    vpnPassword: 'Ri!82*n2HyxC',
  },
].sort((a, b) => a.seat - b.seat);

/** Bash-safe single-quoted string (for passwords with special characters). */
export function shellSingleQuote(value) {
  return `'${String(value).replace(/'/g, "'\\''")}'`;
}

/** One-liner for lab Ubuntu (user devnet) — $(whoami)ws expands to the VPN username at runtime. */
export function buildOpenConnectCommand(seat) {
  const password = shellSingleQuote(seat.vpnPassword);

  return (
    `printf '%s\\n' ${password} | sudo openconnect --protocol anyconnect --user "$(whoami)ws" ` +
    `--passwd-on-stdin --no-dtls ${seat.vpnAddress}`
  );
}

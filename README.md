# iBLio_Config_Tool
Configuration Tool for all iBLio 'Bluetooth Low Energy' Devices

L' App iBLio Config Tool permette di configurare tutti i prodotti IBLio Devices in modo semplice.
In particolare si possono configurare i seguenti servizi :

- Access Control
  Configuration Access with / without Password
  Access Password (when used)
  Configuration Access at Power On Reset for 60 sec with / without Passoerd
  Restore Factory Defaults

- General Configuration
  ADV Period (125, 250, 500 and 1000 msec)
  Interleaving Packets Sequencer 
    iBeacon / EddystoneTLM, 
    EddystoneURL / EddystoneTLM, 
    EddystoneUID / EddystoneTLM, 
    IoT_Node / EddystoneTLM, 
    Mixed Modes ( iBeacon / EddystoneTLM / EddystoneUID / EddystoneURL / IoT_Node / Security)
    User Defined (do not change the current Interleaving Packets Sequence previously set by User)
  Scan Request Control on / off for control the power consumption, reduced if no Scanners activities 
  Transmission Power setting
  Set measured RSSI at 1 meter for distance evaluations on Scanners
  Number of ADV Channels used (1, 2 or 3)

- iBeacon advertisement packet
  UUID
  Major
  Minor

- Eddystone-URL advertisement packet 
  URL Schema
  URL Encoded

- Eddystone-UID advertisement packet 
  UID Namespace
  UID Instance

- Eddystone-TLM interleaving and advertisement packet

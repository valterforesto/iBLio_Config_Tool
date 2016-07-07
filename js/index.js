// (c) 2016 Valter Foresto

var listItem;
var advMAC;
var advItem;
var advTimer;
var now;
var a;
var b;
var status;

//-----------------------------------------------------------------
function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
}

//-----------------------------------------------------------------
function str2ab(str) {
  var buf = new ArrayBuffer(str.length); // 1 bytes for each char
  var bufView = new Uint8Array(buf);
  for (var i=0, strLen=str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

//----------------------------------------------------------------
function advScanFunc() {
  ble.stopScan();
  status = "advScanFunc()";
  ble.startScan([], app.onAdvDevice, app.onError);
  advTimer = setTimeout(advScanFunc, 600); 
}
    
var app = {
  initialize: function() {
    console.log("initialize()");
    scanPage.hidden = true;
    servicePage.hidden = true;
    generalConfigPage.hidden = true;
    accessControlPage.hidden = true;
    ibeaconPage.hidden = true;
    eddystonePage.hidden = true;
    this.bindEvents();
  },

  bindEvents: function() {
    console.log("bindEvents()");
    document.addEventListener('deviceready', this.onDeviceReady, false);
    openURL.addEventListener('touchend', this.tappedImage, false);
    iBeaconButton.addEventListener('touchstart', this.ibeaconPage, false);
    eddystoneButton.addEventListener('touchstart', this.eddystonePage, false);
    accessControlButton.addEventListener('touchstart', this.accessControlPage, false);
    generalConfigButton.addEventListener('touchstart', this.generalConfigPage, false);
    exit5Button.addEventListener('touchend', this.servicePage, false);
    exit4Button.addEventListener('touchend', this.servicePage, false);
    exit3Button.addEventListener('touchend', this.servicePage, false);
    exit2Button.addEventListener('touchend', this.servicePage, false);
    exitButton.addEventListener('touchend', this.disconnect, false);
    scanRescanButton.addEventListener('touchstart', this.refreshDeviceList, false);
    scanDeviceList.addEventListener('touchstart', this.tappedList, false);
  },

	generalConfigPage: function() {
    console.log("general config()");
    scanPage.hidden = true;
    servicePage.hidden = true;
    generalConfigPage.hidden = false;
    accessControlPage.hidden = true;
    ibeaconPage.hidden = true;
    eddystonePage.hidden = true;
    Read_General_Config_Param();
  },
	
	servicePage: function() {
    console.log("service()");
    scanPage.hidden = true;
    servicePage.hidden = false;
    generalConfigPage.hidden = true;
    accessControlPage.hidden = true;
    ibeaconPage.hidden = true;
    eddystonePage.hidden = true;
    Read_Access_Entry();
    document.getElementById("PSW").value = "";    
  },
	
	eddystonePage: function() {
    console.log("eddystone()");
    scanPage.hidden = true;
    servicePage.hidden = true;
    generalConfigPage.hidden = true;
    accessControlPage.hidden = true;
    ibeaconPage.hidden = true;
    eddystonePage.hidden = false;
    Read_Eddystone_Param();
  },
	
	ibeaconPage: function() {
    console.log("ibeacon()");
    scanPage.hidden = true;
    servicePage.hidden = true;
    generalConfigPage.hidden = true;
    accessControlPage.hidden = true;
    ibeaconPage.hidden = false;
    eddystonePage.hidden = true;
    Read_Ibeacon_Param();
  },
	
	accessControlPage: function() {
    console.log("access control()");
    scanPage.hidden = true;
    servicePage.hidden = true;
    generalConfigPage.hidden = true;
    accessControlPage.hidden = false;
    ibeaconPage.hidden = true;
    eddystonePage.hidden = true;
    Read_Access_Control_Param();
  },
	
  onDeviceReady: function() {
    console.log("onDeviceReady()");
    app.refreshDeviceList();
  },

	tappedImage: function() {
    console.log("tappedImage()");
    var ref = window.open('http://www.iblio.net', '_blank', 'location=yes');
  },
	
    //======================================================================================
  onError: function(reason) {
    console.log("onError() - " + status);
    alert("ERROR: " + status  + reason); // real apps should use notification.alert
  },
	
	onDone: function(reason) {
    console.log("onDone() - " + status);
    // alert("DONE: " + status + reason); // real apps should use notification.alert
  },
    
    //======================================================================================
  refreshDeviceList: function() {
    status = "refreshDeviceList()";    
    console.log(status);
    scanPage.hidden = false;
    servicePage.hidden = true;
	  generalConfigPage.hidden = true;
	  accessControlPage.hidden = true;
	  ibeaconPage.hidden = true;
	  eddystonePage.hidden = true;
    scanDeviceList.innerHTML = '';
	  document.getElementById('msg').innerHTML = '';
    //clearInterval(advTimer);
    //ble.stopScan(app.onDone, app.onError); //insert from ADV return
    ble.scan([], 16, app.onDiscoverDevice, app.onError);
  },

  onDiscoverDevice: function(device) {
    console.log("onDiscoverDevice()");
    console.log(JSON.stringify(device));
    if (device.name.match(/iBLio/i)) {
      listItem = document.createElement('li'),
      html = '<b>' + device.name + '</b><br/>' +
      'RSSI: ' + device.rssi + '&nbsp;&nbsp;[' + device.id + ']';
      listItem.dataset.deviceId = device.id;
      listItem.innerHTML = html;
      scanDeviceList.appendChild(listItem);
    }
  },

    //======================================================================================
  tappedList: function(e) {
    console.log("tappedList()");
    advMAC = e.target.dataset.deviceId;
    console.log(advMAC);
    if(advMAC == null) {
      document.getElementById('msg').innerHTML = '<p><b>Please (re)Tap the Device on the List</b></p>';
    }
    else 
		  app.connect();
  },

    //======================================================================================
  advData: function() {
	  status = "advData()";
    console.log(status);
    scanPage.hidden = true;
    servicePage.hidden = true;
	  generalConfigPage.hidden = true;
	  accessControlPage.hidden = true;
	  ibeaconPage.hidden = true;
	  eddystonePage.hidden = true;
    advList.innerHTML = '';
    advItem = document.createElement('li'), html = '<b>' + advMAC + '</b>';
    advItem.innerHTML = html;
    advList.appendChild(advItem);
    ble.startScan([], app.onAdvDevice, app.onError);
    advTimer = setTimeout(advScanFunc, 600); 
  },

    //======================================================================================
  connect: function() {
    status = "connect()";
    console.log(status);
    onConnect = function() {
      console.log("Connected...");
      scanPage.hidden = true;
      servicePage.hidden = false;
      generalConfigPage.hidden = true;
      accessControlPage.hidden = true;
      ibeaconPage.hidden = true;
      eddystonePage.hidden = true;
    };
    ble.stopScan(app.onDone, app.onError);
    ble.connect(advMAC, onConnect, app.onDisconnection);
  },
    
  onDisconnection: function(e) {
    console.log("onDisconnection()");
    alert ("Connection Lost ... Rescan");
    app.refreshDeviceList();
  },

  disconnect: function(e) {
    status = "disconnect()";
    console.log(status);
    ble.disconnect(advMAC, app.refreshDeviceList, app.onError); 
  }

};

var access = {
  service:      "EE0C0000-8786-40BA-AB96-99B91AC981D8",
  pswentry:     "EE0C0001-8786-40BA-AB96-99B91AC981D8",
  accctrl:      "EE0C0002-8786-40BA-AB96-99B91AC981D8",
  accpwd:       "EE0C0003-8786-40BA-AB96-99B91AC981D8",
  accpowon:     "EE0C0004-8786-40BA-AB96-99B91AC981D8",
	accreset:     "EE0C0005-8786-40BA-AB96-99B91AC981D8",
};

var seque = {
  service:      "EE0C0040-8786-40BA-AB96-99B91AC981D8",
  period:       "EE0C0041-8786-40BA-AB96-99B91AC981D8",
  seque:        "EE0C0042-8786-40BA-AB96-99B91AC981D8",
  cntrl:        "EE0C0043-8786-40BA-AB96-99B91AC981D8",
};
	
var general = {
  service:      "EE0C0100-8786-40BA-AB96-99B91AC981D8",
  level:        "EE0C0101-8786-40BA-AB96-99B91AC981D8",
  rssi:         "EE0C0102-8786-40BA-AB96-99B91AC981D8",
  advch:        "EE0C0103-8786-40BA-AB96-99B91AC981D8",
};

var ibeacon = {
  service:      "EE0C2000-8786-40BA-AB96-99B91AC981D8",
  uuid:         "EE0C2001-8786-40BA-AB96-99B91AC981D8",
  major:        "EE0C2002-8786-40BA-AB96-99B91AC981D8",
  minor:        "EE0C2003-8786-40BA-AB96-99B91AC981D8",
};	
	
var eddystoneuid = {
  service:      "EE0C4000-8786-40BA-AB96-99B91AC981D8",
  namespace:    "EE0C4001-8786-40BA-AB96-99B91AC981D8",
  instance:     "EE0C4002-8786-40BA-AB96-99B91AC981D8",
};	
	
var eddystoneurl = {
  service:      "EE0C4100-8786-40BA-AB96-99B91AC981D8",
  scheme1:      "EE0C4101-8786-40BA-AB96-99B91AC981D8",
  url1:         "EE0C4102-8786-40BA-AB96-99B91AC981D8",
  scheme2:      "EE0C4103-8786-40BA-AB96-99B91AC981D8",
  url2:         "EE0C4104-8786-40BA-AB96-99B91AC981D8",
  scheme3:      "EE0C4105-8786-40BA-AB96-99B91AC981D8",
  url3:         "EE0C4106-8786-40BA-AB96-99B91AC981D8",	
};		
	
function Set_PSW() {
  status = "Set_PSW()";
  console.log(status);
  var value = document.getElementById("PSW").value;
  console.log (value);  
  if (value.length != 8) {
    alert("ERROR PASSWORD must be 8 chars"); return;
  }
  var val = str2ab(value);
  console.log (val);
  ble.write(advMAC, access.service, access.pswentry, val, onPwdok, app.onDisc);
}
function onPwdok(reason) {
  alert("ACCESS ENABLED !!");
}


function Set_ADV_period() {				
  status = "Set_ADV_period()";
  console.log(status);
  var value = document.getElementById("ADV_period").value;
  var val = new Uint8Array(1);
  val[0] = value;
  console.log (val.buffer);  
  ble.write(advMAC, seque.service, seque.period, val.buffer, app.onDone, app.onError);
}

function Set_Sequencer() {				
  status = "Set_Sequencer()";  
  console.log(status);
  var value = document.getElementById("Sequencer").value;
  console.log (value);
  if (value > 4) {return;} 
  var s1 = seq_type[value];
  console.log(s1);
  var val = str2ab(s1);
  console.log(val); 
  ble.write(advMAC, seque.service, seque.seque, val, app.onDone, app.onError);
}

function Set_SCAN_Req() {
  status = "Set_SCAN_Req()";
  console.log(status);
  var value = document.getElementById("SCAN_Req").value;
  var val = new Uint8Array(1);
  val[0] = value;
  console.log (val.buffer);  
  ble.write(advMAC, seque.service, seque.cntrl, val.buffer, app.onDone, app.onError);
}

function Set_TX_lev() {
  status = "Set_TX_lev()";
  console.log(status);
  var value = document.getElementById("Tx_lev").value;
  var val = new Uint8Array(1);
  val[0] = value;
  console.log (val.buffer);  
  ble.write(advMAC, general.service, general.level, val.buffer, app.onDone, app.onError);
}

function Set_ADV_ch() {
  status = "Set_ADV_ch()";
  console.log(status);
  var value = document.getElementById("ADV_ch").value;
  var val = new Uint8Array(1);
  val[0] = value;
  console.log (val.buffer);
  ble.write(advMAC, general.service, general.advch, val.buffer, app.onDone, app.onError);
}

function Set_RSSI() {
  status = "Set_RSSI()";
  console.log(status);
  var value = document.getElementById("RSSI").value;
  console.log (value);
  if ((value > 0) || (value < -80)) { alert("ERROR RSSI at 1 meter must be from -80 to 0 dBm"); return;}
  var val = new Int8Array(1);
  val[0] = value;
  console.log (val.buffer);
  ble.write(advMAC, general.service, general.rssi, val.buffer, app.onDone, app.onError);
}

function Set_access_control() {
  status = "Set_access_control()";
  console.log(status);
  var value = document.getElementById("access_control").value;
  var val = new Uint8Array(1);
  val[0] = value;
  console.log(val.buffer);
  ble.write(advMAC, access.service, access.accctrl, val.buffer, app.onDone, app.onError);
}

function Set_password() {
  status = "Set_password()";
  console.log(status);
  var value = document.getElementById("access_password").value;
  console.log (value);
  if (value.length != 8) {
    alert("ERROR Password must be 8 chars"); return;
  }
  var val = str2ab(value);
  console.log (val);
  ble.write(advMAC, access.service, access.accpwd, val, app.onDone, app.onError);
}

function Set_access_at_poweron() {
  status = "Set_access_at_poweron()";
  console.log(status);
  var value = document.getElementById("access_power_on").value;
  var val = new Uint8Array(1);
  val[0] = value;
  console.log (val.buffer);  
  ble.write(advMAC, access.service, access.accpowon, val.buffer, app.onDone, app.onError);
}

function Set_factory_default() {
  status = "Set_factory_default()";
  console.log(status);
  var val = new Uint8Array(1);
  val[0] = 0xFF;
  console.log(val.buffer);
  ble.write(advMAC, access.service, access.accreset, val.buffer, onReset, onDisc);
}
function onDisc(reason) {
  console.log("onDisc()");
  app.refreshDeviceList();
}
function onReset(reason) {
  console.log("onReset()");
}	

function Set_UUID() {
  status = "Set_UUID()";  
  console.log(status);
  var value = document.getElementById("UUID").value;
  console.log(value);
  if (value.length != 32) {
    alert("ERROR UUID must be 32 Bytes"); return;
  }
  var a = value.toUpperCase();
  console.log(a);
  var val = str2ab(a);
  console.log(val);
  var v0 = new DataView(val);
  var i;
  var d;
  for (i=0; i<32; i++) {
    d = v0.getUint8(i);
    console.log(d);
    if ( ((d < 0x30) || (d > 0x39)) && ((d < 0x41) || (d > 0x46)) ) {
      alert("ERROR input must be hexadecimal"); return; 
    }  
  }
  var data = new Uint8Array(16);
  var j = 0;
  for (i=0; i <= 15; i++) {
	  d = v0.getUint8(j);
	  if ((d >= 0x30) && (d <= 0x39)) {
		  data[i] = (d - 0x30) << 4; 
	  }
	  else {
		data[i] = (d - 0x37) << 4;  
	  }
	  j++;
	  d = v0.getUint8(j);
	  if ((d >= 0x30) && (d <= 0x39)) {
		  data[i] = data[i] | (d - 0x30); 
	  }
	  else {
		data[i] = data[i] | (d - 0x37);  
	  }
	  j++; 
  }
  console.log(data.buffer);
  ble.write(advMAC, ibeacon.service, ibeacon.uuid, data.buffer, app.onDone, app.onError);
}

function Set_major() {
  status = "Set_major()";
  console.log(status);
  var value = document.getElementById("major").value;
  console.log (value);
  if ((value < 0) || (value > 65535)) { 
    alert("ERROR Major must be from 0 to 65535"); return;
  }
  var val = new Uint8Array(2);
  val[1] = value >> 8;
  val[0] = value & 0xFF; 
  console.log (val.buffer);
  ble.write(advMAC, ibeacon.service, ibeacon.major, val.buffer, app.onDone, app.onError);
}

function Set_minor() {
  status = "Set_minor()";  
  console.log(status);
  var value = document.getElementById("minor").value;
  console.log (value);
  if ((value < 0) || (value > 65535)) {
    alert("ERROR Minor must be from 0 to 65535"); return;
  }
  var val = new Uint8Array(2);
  val[1] = value >> 8;
  val[0] = value & 0xFF; 
  console.log (val.buffer);
  value = val;
  ble.write(advMAC, ibeacon.service, ibeacon.minor, val.buffer, app.onDone, app.onError);
}

function Set_schema() {
  status = "Set_schema()";  
  console.log(status);
  var value = document.getElementById("Schema").value;
  var val = new Uint8Array(1);
  val[0] = value;
  console.log (val.buffer);  
  ble.write(advMAC, eddystoneurl.service, eddystoneurl.scheme1, val.buffer, app.onDone, app.onError);
}

function Set_URL() {
  status = "Set_URL()";  
  console.log(status);
  var value = document.getElementById("URL").value;
  console.log (value);
  if ((value.length < 4) || (value.length > 16) ) {
    alert("ERROR URL must be 4 to 16 chars"); return;
  }
  var val = str2ab(value);
  console.log (val);
  ble.write(advMAC, eddystoneurl.service, eddystoneurl.url1, val, app.onDone, app.onError);
} 

function Set_UID_namespace() {
  status = "Set_UID_namespace()";  
  console.log(status);
  var value = document.getElementById("UID_namespace").value;
  console.log(value);
  if (value.length != 20) {
    alert("ERROR UID Namespace must be 20 Bytes"); return;
  }
  var a = value.toUpperCase();
  console.log(a);
  var val = str2ab(a);
  console.log(val);
  var v0 = new DataView(val);
  var i;
  var d;
  for (i=0; i<20; i++) {
	d = v0.getUint8(i);
	console.log(d);
    if ( ((d < 0x30) || (d > 0x39)) && ((d < 0x41) || (d > 0x46)) ) {
      alert("ERROR input must be hexadecimal"); return; 
    }
  }
  var data = new Uint8Array(10);
  var j = 0;
  for (i=0; i <= 9; i++) {
	  d = v0.getUint8(j);
	  if ((d >= 0x30) && (d <= 0x39)) {
		  data[i] = (d - 0x30) << 4; 
	  }
	  else {
		data[i] = (d - 0x37) << 4;  
	  }
	  j++;
	  d = v0.getUint8(j);
	  if ((d >= 0x30) && (d <= 0x39)) {
		  data[i] = data[i] | (d - 0x30); 
	  }
	  else {
		data[i] = data[i] | (d - 0x37);  
	  }
	  j++; 
  }
  console.log(data.buffer);
  ble.write(advMAC, eddystoneuid.service, eddystoneuid.namespace, data.buffer, app.onDone, app.onError);
}

function Set_UID_instance() {
  status = "Set_UID_instance()";  
  console.log(status);
  var value = document.getElementById("UID_instance").value;
  console.log(value);
  if (value.length != 12) {
    alert("ERROR UID Instance must be 12 Bytes"); return;
  }
  var a = value.toUpperCase();
  console.log(a);
  var val = str2ab(a);
  console.log(val);
  var v0 = new DataView(val);
  var i;
  var d;
  for (i=0; i<12; i++) {
    d = v0.getUint8(i);
    console.log(d);
    if ( ((d < 0x30) || (d > 0x39)) && ((d < 0x41) || (d > 0x46)) ) {
      alert("ERROR input must be hexadecimal"); return; 
    }
  }
  var data = new Uint8Array(6);
  var j = 0;
  for (i=0; i <= 5; i++) {
	  d = v0.getUint8(j);
	  if ((d >= 0x30) && (d <= 0x39)) {
		  data[i] = (d - 0x30) << 4; 
	  }
	  else {
      data[i] = (d - 0x37) << 4;  
	  }
	  j++;
	  d = v0.getUint8(j);
	  if ((d >= 0x30) && (d <= 0x39)) {
		  data[i] = data[i] | (d - 0x30); 
	  }
	  else {
      data[i] = data[i] | (d - 0x37);  
	  }
	  j++; 
  }
  console.log(data.buffer);
  ble.write(advMAC, eddystoneuid.service, eddystoneuid.instance, data.buffer, app.onDone, app.onError);
}

function Read_General_Config_Param() {
	console.log("Read_General_Config_Param()");
	Read_ADV_period();
	Read_Sequencer();
	Read_Scan_Request();
	Read_Tx_Level();
	Read_RSSI();
	Read_ADV_Channel();
}

function Read_Access_Control_Param() {
	console.log("Read_Access_Control_Param()");
	Read_Access_Control();
  Read_Access_Passord();
	Read_Access_Power_On();
}

function Read_Eddystone_Param() {			
	console.log("Read_Eddystone_Param()");
	Read_Scheme();
	Read_Instance();
	Read_Namespace();
	Read_URL();
}	

function Read_Ibeacon_Param() {			
	console.log("Read_Ibeacon_Param()");
	Read_UUID();
  Read_Major();
	Read_Minor();
}	

function Read_Access_Entry() {
  status = "Read_Access_Entry()";
  console.log(status);
  ble.read(advMAC, seque.service, seque.period, UpdateUI_Access_Entry, app.onError);
}
function UpdateUI_Access_Entry(val) {
  console.log(val);
  var x = new DataView(val, 0);
  console.log(x.getInt8(0));
  document.getElementById("xxxxxxx").value = x.getInt8(0);
}

function Read_Access_Control() {			
  status = "Read_Access_Control()";
  console.log(status);
  ble.read(advMAC, access.service, access.accctrl, UpdateUI_Access_Control, app.onError);
}
function UpdateUI_Access_Control(val) {
  console.log(val);
  var x = new DataView(val, 0);
  console.log(x.getInt8(0));
  document.getElementById("access_control").value = x.getInt8(0);
}		

function Read_Access_Passord() {						
  status = "Read_Access_Password()";	
  console.log(status);
  ble.read(advMAC, access.service, access.accpwd, UpdateUI_Access_Password, app.onError);
}
function UpdateUI_Access_Password(val) {
  console.log(val);
  var s1 = ab2str(val);
  console.log(s1);
  document.getElementById("access_password").value = s1;
}		

function Read_Access_Power_On() {			
	status = "Read_Access_Power_On()";
	console.log(status);
	ble.read(advMAC, access.service, access.accpowon, UpdateUI_Access_Power_On, app.onError);
}
function UpdateUI_Access_Power_On(val) {
  console.log(val);
  var x = new DataView(val, 0);
  console.log(x.getInt8(0));
  document.getElementById("access_power_on").value = x.getInt8(0);
}	

function Read_ADV_period() {			
  status = "Read_ADV_period()";	
  console.log(status);
  ble.read(advMAC, seque.service, seque.period, UpdateUI_ADV_period, app.onError);
}
function UpdateUI_ADV_period(val) {
  console.log(val);
  var x = new DataView(val, 0);
  console.log(x.getInt8(0));
  document.getElementById("ADV_period").value = x.getInt8(0);
}

var seq_type = ["0000000000000003",
                "2222222222222223",
                "1111111111111113",
                "5555555555555553",
                "0302050204020502"];
function Read_Sequencer() {
  status = "Read_Sequencer()";	
  console.log(status);
  ble.read(advMAC, seque.service, seque.seque, UpdateUI_Read_Sequencer, app.onError);
}
function UpdateUI_Read_Sequencer(val) {
  console.log(val);
  var s1 = ab2str(val);
  console.log(s1);
  var i;
  var res=5;
  for (i=0; i<=4; i++) {
    if (s1==seq_type[i]) { res=i; break;} 	  
  }
  document.getElementById("Sequencer").value = res;
}


function Read_Scan_Request() {			
  status = "Read_Scan_Request()";	
  console.log(status);
  ble.read(advMAC, seque.service, seque.cntrl, UpdateUI_Scan_Request, app.onError);
}
function UpdateUI_Scan_Request(val) {
  console.log(val);
  var x = new DataView(val, 0);
  console.log(x.getInt8(0));
  document.getElementById("SCAN_Req").value = x.getInt8(0);
}

function Read_Tx_Level() {			
  status = "Read_Tx_Level()";	
  console.log(status);
  ble.read(advMAC, general.service, general.level, UpdateUI_Tx_Level, app.onError);
}
function UpdateUI_Tx_Level(val) {
  console.log(val);
  var x = new DataView(val, 0);
  console.log(x.getInt8(0));
  document.getElementById("Tx_lev").value = x.getInt8(0);
}

function Read_RSSI() {
  status = "Read_RSSI()";  
  console.log(status);
  ble.read(advMAC, general.service, general.rssi, UpdateUI_Read_RSSI, app.onError);
}
function UpdateUI_Read_RSSI(val) {
  console.log(val);
  var v0 = new DataView(val);
  var d = v0.getInt8(0);
  console.log(d);
  document.getElementById("RSSI").value = d;
}

function Read_ADV_Channel() {			
  status = "Read_ADV_Channel()";	
  console.log(status);
  ble.read(advMAC, general.service, general.advch, UpdateUI_ADV_Channel, app.onError);
}

function UpdateUI_ADV_Channel(val) {
  console.log(val);
  var x = new DataView(val, 0);
  console.log(x.getInt8(0));
  document.getElementById("ADV_ch").value = x.getInt8(0);
}

function Read_UUID() {
  status = "Read_UUID()";	
  console.log(status);
  ble.read(advMAC, ibeacon.service, ibeacon.uuid, UpdateUI_Read_UUID, app.onError);
}
function UpdateUI_Read_UUID(val) {
  console.log(val);
  var v0 = new DataView(val);
  var c = "";
  for (var i=0; i<v0.byteLength; i++) {
    var d = v0.getUint8(i);
    var h = d.toString(16).toUpperCase();
    c += String(h);
  }
  console.log(c);
  document.getElementById("UUID").value = c;
}

function Read_Major() {			
  status = "Read_Major()";	
  console.log(status);
  ble.read(advMAC, ibeacon.service, ibeacon.major, UpdateUI_Read_Major, app.onError);
}
function UpdateUI_Read_Major(val) {
  console.log(val);
  var v0 = new DataView(val);
  var d = v0.getUint16(0,true); //get littleEndian
  console.log(d);
  document.getElementById("major").value = d;
}

function Read_Minor() {			
  status = "Read_Minor()";	
  console.log(status);
  ble.read(advMAC, ibeacon.service, ibeacon.minor, UpdateUI_Read_Minor, app.onError);
}
function UpdateUI_Read_Minor(val) {
  console.log(val);
  var v0 = new DataView(val);
  var d = v0.getUint16(0,true); //get littleEndian
  console.log(d);
  document.getElementById("minor").value = d;
}

function Read_Instance() {			
  status = "Read_Instance()";	
  console.log(status);
  ble.read(advMAC, eddystoneuid.service, eddystoneuid.instance, UpdateUI_Read_Instance, app.onError);
}
function UpdateUI_Read_Instance(val) {
  console.log(val);
  var v0 = new DataView(val);
  var c = "";
  for (var i=0; i<v0.byteLength; i++) {
    var d = v0.getUint8(i);
    var h = d.toString(16).toUpperCase();
    c += String(h);
  }
  console.log(c);
  document.getElementById("UID_instance").value = c;
}

function Read_Namespace() {			
  status = "Read_Namespace()";	
  console.log(status);
  ble.read(advMAC, eddystoneuid.service, eddystoneuid.namespace, UpdateUI_Read_Namespace, app.onError);
}
function UpdateUI_Read_Namespace(val) {
  console.log(val);
  var v0 = new DataView(val);
  var c = "";
  for (var i=0; i<v0.byteLength; i++) {
    var d = v0.getUint8(i);
    var h = d.toString(16).toUpperCase();
    c += String(h);
  }
  console.log(c);
  document.getElementById("UID_namespace").value = c;
}

function Read_Scheme() {			
  status = "Read_Scheme()";	
  console.log(status);
  ble.read(advMAC, eddystoneurl.service, eddystoneurl.scheme1, UpdateUI_Scheme, app.onError);
}
function UpdateUI_Scheme(val) {
  console.log(val);
  var x = new DataView(val, 0);
  console.log(x.getInt8(0));
  document.getElementById("Schema").value = x.getInt8(0);
}

function Read_URL() {			
  status = "Read_URL()";	
  console.log(status);
  ble.read(advMAC, eddystoneurl.service, eddystoneurl.url1, UpdateUI_Read_URL , app.onError);
}
function UpdateUI_Read_URL(val) {
  console.log(val);
  var s1 = ab2str(val);
  console.log(s1);
  document.getElementById("URL").value = s1;
}
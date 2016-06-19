var CooMan = CooMan || {};

CooMan.read = function(){
	// convert a string into a boolean value
	var checkBool = function(boolean){
		switch(boolean.toLowerCase()) {
			case "false": case "no": case "0": case "": return false;
			default: return true;
		}
	};
	var cookie = document.cookie;
	if(!cookie){ // if the cookie is null
		var d = new Date();
		// the cookie should last for two month
	    d.setTime(d.getTime() + ( 60 *24*60*60*1000));
		// we init with default values
		// a single string takes far less space once minified
		cookie = "expires="+d.toUTCString()+
";name=Snoname;model=N0;colorAlpha=S#0000FF;colorBeta=S#FF0000;colorOwn1=S#00FF00;colorOwn2=S#FFFFFF;colorLaser=S#FFFF00;isFullscreen=Bfalse;displayX=N1280;displayY=N720;volumeMaster=N50;volumeEffect=N50;volumeMusic=N50;mouseS=N50;invertX=Bfalse;invertY=Bfalse;moveF=K87;moveB=K83;moveL=K65;moveR=K68;jump=K32;crounch=K16;fire1=M0;fire2=M2;use=K69;reload=K82;melee=K81;zoom=M1;prevWeap=M-1;nextWeap=M-2;weap1=K49;weap2=K50;weap3=K51;weap4=K52;weap5=K53;weap6=K54;weap7=K55;weap8=K56;weap9=K57;weap0=K48";
		document.cookie = cookie;
	}
	// for each cookie we've defined
	var cookies = cookie.split(";");
	for(var i=0; i<cookies.length; i++){
		// we recover a couple ( key, value )
		var couple = cookies[i].split("=");
		// as long as we have two elements
		if( couple.length == 2 ){
			// we analyze the cookie
			var option = couple[0]; // option name
			var type   = couple[1].charAt(0);    // value type
			var data   = couple[1].substring(1); // the value of the option
			// we recover the value for the given data
			var value; // default value is null
			switch(type){
				case "B": value = checkBool(data); break; // boolean
				case "N": value = parseFloat(data); break; // number
				case "S": value = data; break; // string
				case "K": value = { btn: parseInt(data) }; break; // key input
				case "M": value = { btn: parseInt(data), isMouse: true }; break; // mouse input
			}
			// we set the option value if option is not null
			CooMan.options[option] = value;
		}
	}
	return CooMan.options;
};
// we want to try to load the configuration stored in the cookie
CooMan.read();

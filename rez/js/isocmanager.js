var AccountPanel = {
	baseRequestUrl : "https://ssl.hardcastle.org:3001",
	panelCode : 
		'<div id="AccountPanel">'+
		'	<div id="AP_LinksAuthorized">'+
		'		<span id="AP_userFullname"></span>'+
		'		&nbsp;&bullet;&nbsp;'+
		'		<a href="#" id="AP_Logout">Log Out</a>'+
		'	</div>'+
		'	<div id="AP_Links">'+
		'		<a href="#" class="AP_topLink" id="AP_Request">Request An Account</a>'+
		'		&nbsp;&bullet;&nbsp;'+
		'		<a href="#" class="AP_topLink" id="AP_Login">Log In</a>'+
		'		&nbsp;&bullet;&nbsp;'+
		'		<a href="#" class="AP_topLink" id="AP_Reset">Reset Password</a>'+
		'	</div>'+
		'	<div id="AP_ResetPanel" class="AP_Panel">'+
		'		<h2>Reset Password</h2>'+
		'       <h3>Step One: We email you a secret code.</h3>'+
		'		<form id="AP_ResetForm1">'+
		'			<p><span class="pill">E-mail: <input name="email" type="text"></span></p>'+
		'			<p><input type=submit value="Submit"></p>'+
		'		</form>'+
		'       <h3>Step Two: Enter the secret code and a new password below.</h3>'+
		'		<form id="AP_ResetForm2">'+
		'			<p><span class="pill">Secret Code: <input name="specialCode" type="text"></span></p>'+
		'			<p><span class="pill">New Password: <input name="password" type="password"></span></p>'+
		'			<p><input type=submit value="Reset"></p>'+
		'		</form>'+
		'		<a href="" class="x">x</a>'+
		'	</div>'+
		'	<div id="AP_LoginPanel" class="AP_Panel">'+
		'		<h2>Log In</h2>'+
		'		<form id="AP_LoginForm">'+
		'			<p><span class="pill">E-mail: <input name="email" type="text"></span></p>'+
		'			<p><span class="pill">Password: <input name="password" type="password"></span></p>'+
		'			<p><input type=submit value="Log in"></p>'+
		'		</form>'+
		'		<a href="" class="x">x</a>'+
		'	</div>'+
		'	<div id="AP_RequestPanel" class="AP_Panel">'+
		'		<h2>Request An Account</h2>'+
		'		<form id="AP_RequestForm">'+		
		'			<p><span class="pill">Full Name: <input type="text" name="fullname"></span></p>'+
		'			<p><span class="pill">E-mail Address: <input type="text" name="email"></span></p>'+
		'			<p><span class="pill">Password: <input type="password" name="password"></span></p>'+
		'			<p><input type="submit" value="Submit"></p>	'+
		'		</form>'+
		'		<a href="" class="x">x</a>'+
		'	</div>'+
		'</div>',
	n : null,
	o : function(panelName){		
		AccountPanel.c(function() {
			$('#AccountPanel').addClass('open'+panelName, 1000, 'easeOutBounce', function(){
				$('#'+panelName+"Panel").fadeIn();
				AccountPanel.n = panelName;
			});		
		});
	},
	c : function(next){
		if(null!=AccountPanel.n) {
			$('#'+AccountPanel.n+"Panel").fadeOut( function(){		
				var class_to_remove = $('#AccountPanel').attr('class');
				$('#AccountPanel').removeClass(class_to_remove, 100, 'easeOutSine', function(){ AccountPanel.n = null; if(next) next(); })
			});		
		} else {
			if(next) next();
		}
	},
	stateChangeCallbacks : null,
	registerForStateChange : function(callback){
		console.log("registerForStateChange");
		if(null==AccountPanel.stateChangeCallbacks) {
			AccountPanel.stateChangeCallbacks = new Array();
			AccountPanel.stateChangeCallbacks.push(callback);
		} else {
			var ii = AccountPanel.stateChangeCallbacks.length;
			var found=false;
			for (var i=0; i<ii; i++) {
				if(AccountPanel.stateChangeCallbacks[i]==callback){
					found=true;
					break;
				}
			}
			if(!found){
				AccountPanel.stateChangeCallbacks.push(callback);			
			}		
		}		
	},
	unregisterFromStateChange : function(callback) {
		console.log("unregisterFromStateChange");
	 	if(null!=AccountPanel.stateChangeCallbacks) {
	 		var ii = AccountPanel.stateChangeCallbacks.length;
	 		for (var i=0; i<ii; i++) {
				if(AccountPanel.stateChangeCallbacks[i]==callback){
					console.log("found and removing");
					AccountPanel.stateChangeCallbacks.splice(i,1);
					break;
	 			}
	 		}		
	 	}
	 },
	notifyAboutStateChange : function() {
		console.log("triggerStateChange");
		if(null!=AccountPanel.stateChangeCallbacks) {
			var ii = AccountPanel.stateChangeCallbacks.length;
			for (var i=0; i<ii; i++) {
				console.log("calling "+i);
				AccountPanel.stateChangeCallbacks[i]();
			}		
		}
	},
	resetStep1 : function(event) {
		$.ajax({cache:false,
			dataType: "json",
			url : AccountPanel.baseRequestUrl+"/account/password/reset/step1",
			type: "post",
			data: $(event.target).serialize()
		})
		.done( function(d) {
			if(d.status=="success"){
				alert('Your reset request has been received and will expire in 30 minutes. You will receive an email containing a special code which you must use in step 2 below.');
			} else {
				alert('Request Failed. Please try again later.');
			}
		});
	},
	resetStep2 : function(event) {
		AccountPanel.c();
		$.ajax({cache:false,
			dataType: "json",
			url : AccountPanel.baseRequestUrl+"/account/password/reset/step2",
			type: "post",
			data: $(event.target).serialize()
		})
		.done(function(d) {
			if(d.status=="success"){
				alert('Your password has been reset successfully.');
			} else {
				alert('Request Failed. Please try again later.');
			}
		});
	},
	logout : function(_callback) {
		$('#AP_LinksAuthorized').hide();
		$.ajax({cache:false,
			dataType: "json",
			url : AccountPanel.baseRequestUrl+"/account/logout",
			type: "get",
			headers: {'x-access-token':$.cookie("access_token")}
		})			
		.done(function(d) {
			$('#AP_Links').show();
			$.removeCookie("access_token");	
			AccountPanel.isLoggedIn = false;		
			AccountPanel.notifyAboutStateChange();
		})			
		.always( function(){ if(_callback) _callback(); });
	},
	checkForAccessToken : function(_callback) {
		// check for JWT token in a cookie. If it exists, check to see whether the user is logged 
		// in.  If not, remove cookie and display login form.
		var access_token = $.cookie("access_token");

		if(undefined!=access_token) {
			$.ajax({cache:false,
				dataType: "json",
				url : AccountPanel.baseRequestUrl+"/account/status",
				type: "get",
				headers: {'x-access-token':access_token}				
			})
			.done( function(d) {
				if(d.status=="success"){
					AccountPanel.loggedInState(d.user);
					AccountPanel.isLoggedIn = true;
				} else {
					$.removeCookie("access_token");	
				}				
				$('#AccountPanel').show();
			}) 
			.always( function(){ if(_callback) _callback(); });
			 
		} else {
			$('#AccountPanel').show();
			AccountPanel.loggedOutState();
			if(_callback) _callback();
		}
	},
	isLoggedIn : false,
	loggedOutState : function(fullname){
		$('#AP_Links').show();
		$('#AP_LinksAuthorized').hide();
	}, 
	loggedInState : function(fullname){
		$('#AP_Links').hide();
		$('#AP_LinksAuthorized').show();
		$('#AP_userFullname').html(fullname);
	},
	requestAccount : function(){
		AccountPanel.c();
		$.ajax({cache:false,
			dataType: "json",
			url : AccountPanel.baseRequestUrl+"/account/create",
			type: "post",
			data: $(event.target).serialize(),
			success: function(d) {
				if(d.status=="success"){
					alert('Your account request has been received. You will be notified when you are approved.');
				} else {
					alert('Request Failed. Please try again later.');			
				}
				$('#AP_RequestForm input:text').val("");
				$('#AP_RequestForm input:password').val("");
				AccountPanel.c();		
			}
		}); 		
	},
	l : function(event){				
		$.ajax({cache:false,
			url : AccountPanel.baseRequestUrl+"/account/login",
			type: "post",
			data: $(event.target).serialize(),
			success: function(d) {
				if(d.status=="success"){
					$.cookie("access_token", d.token);
					AccountPanel.c();
					AccountPanel.loggedInState(d.user);
					AccountPanel.isLoggedIn = true;	
					AccountPanel.notifyAboutStateChange();				
				} else {
					alert('Authentication failed. Either your e-mail and/or password is incorrect, or your manager account has not yet been approved. ');
					$('#AP_LoginForm input:text').val("");
					$('#AP_LoginForm input:password').val("");
					AccountPanel.c();
				}
			}
		}); 
	}, 		 
	i : function(callback) {		
		$('body').append(AccountPanel.panelCode);
		$('#AccountPanel').hide();
		
		AccountPanel.checkForAccessToken(callback);		
		
		$('.AP_Panel').hide();
		$('.AP_topLink').click(function(e){ e.preventDefault(); AccountPanel.o($(e.target).attr('id')); });
		$('.x').click(function(e){ e.preventDefault(); AccountPanel.c(); });
		$('#AP_Logout').click(function() { AccountPanel.logout() });
		$("#AP_ResetForm1").submit(function(event){ event.preventDefault(); AccountPanel.resetStep1(event); });
		$("#AP_ResetForm2").submit(function(event){ event.preventDefault(); AccountPanel.resetStep2(event); });		
		$("#AP_RequestForm").submit(function(event){ event.preventDefault(); AccountPanel.requestAccount(); }); 				
		$("#AP_LoginForm").submit(function(event){ event.preventDefault();AccountPanel.l(event);});
		
	},
	analyzeSite : function(_domainName, _policyName, _callback){
		$.ajax({
			cache:false,
			dataType: "json",
			url : AccountPanel.baseRequestUrl+"/site/analyze",
			type: "post",
			headers: {'x-access-token':$.cookie("access_token")},
			data: {
				domainName : _domainName,
				policyName : _policyName
			}
		})
		.done(function(d) { if(_callback) _callback();});			
	},
	markVersionIgnore : function(_domainName, _policyName, _snapshotVersion, _comment, _callback){
		$.ajax({
			cache:false,
			dataType: "json",
			url : AccountPanel.baseRequestUrl+"/site/snapshot/ignore",
			type: "post",
			headers: {'x-access-token':$.cookie("access_token")},
			data: {
				domainName : _domainName,
				policyName : _policyName,
				snapshotVersion : _snapshotVersion,
				comment : _comment
			}
		})
		.done(function(d) { if(_callback) _callback();});		
	},
	unmarkVersionIgnore : function(_domainName, _policyName, _snapshotVersion, _callback){
		$.ajax( {
			cache:false,
			dataType: "json",
			url : AccountPanel.baseRequestUrl+"/site/snapshot/unignore",
			type: "post",
			headers: {'x-access-token':$.cookie("access_token")},
			data: {
				domainName : _domainName,
				policyName : _policyName,
				snapshotVersion : _snapshotVersion,
			}
		})
		.done(function(d) { if(_callback) _callback();});		
	},
	addCommentary : function(_domainName, _policyName, _snapshotVersion, _comment, _callback){
		$.ajax({
			cache:false,
			dataType: "json",
			url : AccountPanel.baseRequestUrl+"/site/snapshot/comment",
			type: "post",
			headers: {'x-access-token':$.cookie("access_token")},
			data: {
				domainName : _domainName,
				policyName : _policyName,
				snapshotVersion : _snapshotVersion,
				comment : _comment
			}
		})
		.done(function(d) {	if(_callback) _callback();});
	},
	removeCommentary : function(_domainName, _policyName, _snapshotVersion, _callback){
	 	$.ajax({
		 	cache:false,
	 		dataType: "json",
	 		url : AccountPanel.baseRequestUrl+"/site/snapshot/uncomment",
	 		type: "post",
	 		headers: {'x-access-token':$.cookie("access_token")},
	 		data: {
	 			domainName : _domainName,
	 			policyName : _policyName,
	 			snapshotVersion : _snapshotVersion
	 		}
	 	})
	 	.done(function(){ if(_callback) _callback(); }); 		
	 },
	addExtractionPattern : function(_domainName, _policyName, _snapshotVersion, _matchString, _callback){
		$.ajax({
			cache:false,
			dataType: "json",
			url : AccountPanel.baseRequestUrl+"/site/rule/create",
			type: "post",
			headers: {'x-access-token':$.cookie("access_token")},
			data: {
				domainName : _domainName,
				policyName : _policyName,
				snapshotVersion : _snapshotVersion,
				matchString : "<![CDATA["+_matchString+"]]>"
			}
		})
		.done(function(d) {	if(_callback) _callback();});
	},
	removeExtractionPattern : function(_domainName, _policyName, _snapshotVersion, _callback){
		$.ajax({
			cache:false,
			dataType: "json",
			url : AccountPanel.baseRequestUrl+"/site/rule/delete",
			type: "post",
			headers: {'x-access-token':$.cookie("access_token")},
			data: {
				domainName : _domainName,
				policyName : _policyName,
				snapshotVersion : _snapshotVersion			}
		})
		.done(function(d) {	if(_callback) _callback();});
	},
	markVersionAsDeparture : function(_domainName, _policyName, _snapshotVersion, _comment, _callback){
		$.ajax({
			cache:false,
			dataType: "json",
			url : AccountPanel.baseRequestUrl+"/site/snapshot/begin",
			type: "post",
			headers: {'x-access-token':$.cookie("access_token")},
			data: {
				domainName : _domainName,
				policyName : _policyName,
				snapshotVersion : _snapshotVersion,
				comment : _comment
			}
		})
		.done(function(d) { if(_callback) _callback();});		
	},
	suggestions: function(_callback){
		$.ajax({
			dataType:"json", contentType:"application/json; charset=utf-8", headers:{'X-Access-Token':$.cookie("access_token")}, type:'POST',
			url: AccountPanel.baseRequestUrl+"/site/suggested"
		})
		.done(function(d){ if(_callback) _callback(d);}
		);
	},
	removeSuggestion: function(_domainId, _docId, _callback){
		var data = { docId: _docId, domainId: _domainId	};
		$.ajax({
			dataType:"json", contentType:"application/json; charset=utf-8", headers:{'X-Access-Token':$.cookie("access_token")}, type:'POST',
			url: AccountPanel.baseRequestUrl+"/site/removesuggestion",
			data: JSON.stringify(data)
		})
		.done(function(d){ if(_callback) _callback(d);}
		);
	},
	createRuleFromSuggestion: function(_domainId, _docId, _url, _policyName, _callback){
		var data = { docId: _docId, domainId: _domainId, url:_url, policyName:_policyName };
		$.ajax({
			dataType:"json", contentType:"application/json; charset=utf-8", headers:{'X-Access-Token':$.cookie("access_token")}, type:'POST',
			url: AccountPanel.baseRequestUrl+"/site/save",
			data: JSON.stringify(data)
		})
		.done(function(d){ if(_callback) _callback(d);}
		);
	},

	unmarkVersionAsDeparture : function(_domainName, _policyName, _snapshotVersion, _callback){
		var data = { domainName : _domainName, policyName : _policyName, snapshotVersion : _snapshotVersion };
		this.a("/site/snapshot/unbegin", data, _callback);
	},
	/* Generic API Call */
	a : function(_api_method, _data, _callback) {
		$.ajax({
			cache:false,
			dataType: "json",
			url : AccountPanel.baseRequestUrl+_api_method,
			type: "post",
			headers: {'x-access-token':$.cookie("access_token")},
			data: _data
		})
		.done(function(d) { if(_callback) _callback();});			
	}
	
};


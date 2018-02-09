var LotBox = React.createClass({

	loadLotsFromServer: function() {
	    $.ajax({
            headers: {
                'Authorization':'Bearer ' + sessionStorage.getObject("tokenData").token
            },
	      	url: this.props.url,
	      	dataType: 'json',
	      	cache: false,
	      	type: 'GET',
	      	success: function(data) {
	      		this.setState({data: data});
	      	}.bind(this),
	      	error: function(xhr, status, err) {
	      		console.error(this.props.url, status, err.toString());
	      	}.bind(this)
	    });
	},
	
	handleLotSubmit: function(lot, update) {
		var method = 'POST'
		var requestUrl = this.props.url;
		
		
		if(update){
			method = 'PUT';
			requestUrl = requestUrl + "/" + lot.id;
		}else{
			lot.id = Date.now();	
		}
		
	    var lots = this.state.data;
	    // Optimistically set an id on the new comment. It will be replaced by an
	    // id generated by the server. In a production application you would likely
	    // not use Date.now() for this and would have a more robust system in place.
	    
	    
	    var newLots = lots.concat([lot]);
	    this.setState({data: newLots});
	    $.ajax({
	    	headers: {
                'Authorization':'Bearer ' + sessionStorage.getObject("tokenData").token
            },
            contentType: "application/json;charset=utf-8",
            url: requestUrl,
            dataType: 'json',
            type: method,
            data: JSON.stringify(lot),
            success: function(data) {
            	this.loadLotsFromServer();
            	$('#lotFormModal').modal('hide');
            }.bind(this),
            error: function(xhr, status, err) {
            	this.setState({data: lots});
            	console.error(this.props.url, status, err.toString());
            }.bind(this)
	    });
	  },
	  
	  handleLotDelete: function(lot) {
		  $.ajax({
			  headers: {
				  'Authorization':'Bearer ' + sessionStorage.getObject("tokenData").token
			  },
			  contentType: "application/json;charset=utf-8",
			  url: this.props.url + "/" + lot.id,
			  //dataType: 'json',
			  type: 'DELETE',
			  //data: JSON.stringify(lot),
			  success: function(data) {
				  this.loadLotsFromServer();
			  }.bind(this),
			  error: function(xhr, status, err) {
				  this.loadLotsFromServer();
				  console.error(this.props.url, status, err.toString());
			  }.bind(this)
		  });
	  },

	  handleLotUpdate: function(lot) {
		  this.handleLotSubmit(lot, true);
	  },
	  
	  getInitialState: function() {
		  return {data: []};
	  },

	  componentDidMount: function() {
		  this.loadLotsFromServer();
	  },
	  
	  handleRefresh: function(){
		 this.loadLotsFromServer();
	  },

	  render: function() {
	    return (
	      <div className="lotBox">
	      	<div className="row">
	      		<div className="col-lg-12">
	      			<h1 className="page-header">Lots</h1>
	      		</div>
	      	</div>
			<LotList data={this.state.data} onLotDelete={this.handleLotDelete} onLotUpdate={this.handleLotUpdate} onRefresh={this.handleRefresh} />
			<LotFormQuick onLotSubmit={this.handleLotSubmit} />
			<br/>
	       </div>
	    );
	  }
});
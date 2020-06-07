$(document).ready(function() {
	$("#services_offered_table > thead input:checkbox").click(function(){
		if($(this).prop("checked"))
			$("#services_offered_table > tbody > tr > td:nth-child(1) input:checkbox").prop("checked",false).click();
		else
			$("#services_offered_table > tbody > tr > td:nth-child(1) input:checkbox").prop("checked",true).click();
	});
	$("#services_offered_table td:nth-child(1) input:checkbox").click(function(){
		var row_number = $(this).parents("tr").prevAll("tr").length + 1;
		if($(this).prop("checked")){
			$("#service_charges_table tbody tr:nth-child("+row_number+")").css({'background':'none','pointer-events':'auto'});
			$("#service_charges_table tbody tr:nth-child("+row_number+")").find(".ui-spinner:not(.ui-spinner:last)").addClass("active_spinner");
			$(this).parents("tr").css({'background':'none','pointer-events':'auto'});
			$(this).parents("tr").find(".service_availability_table th").not(".service_availability_table th:nth-child(5)").css({'background':'#c14e00','color':'#ffffff'});
			$(this).parents("tr").find(".button_like_link").css({'background':'#E85C00','border-color':'#E85C00','color':'#ffffff'});
		}
		else{
			$("#service_charges_table tbody tr:nth-child("+row_number+")").css({'background':'#FFFBF2','pointer-events':'none'});
			$("#service_charges_table tbody tr:nth-child("+row_number+")").find(".ui-spinner").removeClass("active_spinner");
			$("#service_charges_table tbody tr:nth-child("+row_number+") td:nth-child(5) input").prop("checked",false);
			$("#service_charges_table tbody tr:nth-child("+row_number+")").find(".number_spinner").val("");
			$("#service_charges_table tbody tr:nth-child("+row_number+")").find(".error_message").text("");
			$(this).parents("tr").css({'background':'#FFFBF2','pointer-events':'none'});
			$(this).parents("tr").find(".service_availability_table th").not(".service_availability_table th:nth-child(5)").css({'background':'#fff0d7','color':'#E85C00'});
			$(this).parents("tr").find(".button_like_link").css({'background':'#fff0d7','border-color':'#fff0d7','color':'#E85C00'});
			$(this).parents("tr").find("tr:nth-child(2)").nextAll().remove();
			$(this).parents("tr").find(".error_message").text("");
			$(this).parents("tr").find("input:not(input:checkbox)").val("");
		}
	});
	$(".button_like_link").hover(
	function(){
		$(this).css({'background':'#c14e00','border-color':'#c14e00'});
	},
	function(){
		$(this).css({'background':'#E85C00','border-color':'#E85C00'});
	});
	$(".button_like_link").click(function(event){
		if($(this).next().length > 0){ // "View slots" was clicked
			var error_exist_and_focus_found = 0;
			var grand_parent_row = $(this).parents("tr");
			$(grand_parent_row).find("input:not(input:checkbox)").each(function() {
				services_offered_error($(this),1);
				if($(this).parent().next().text()!="" && error_exist_and_focus_found == 0){
					$(this).focus();
					event.preventDefault();
					error_exist_and_focus_found = 1;
				}
			});
			if(error_exist_and_focus_found == 0){
				var service_name = $(grand_parent_row).children("td:nth-child(2)").text();
				var service_time = parseInt($(grand_parent_row).children("td:nth-child(3)").find("input").val());
				var slot_capacity = $(grand_parent_row).children("td:nth-child(4)").find("input").val();
				$("#slot_viewer_service_name").text(service_name);
				$("#slot_viewer_service_time").text(service_time);
				$("#slot_viewer_slot_capacity").text(slot_capacity);
				var service_availability_table = $(grand_parent_row).children("td:nth-child(5)").children();
				$(".slot_viewer_slot_table:eq(0) tbody").html("");
				var slot_table_tbody = $(".slot_viewer_slot_table:eq(0) tbody");
				var slot_number = 1;
				var slot_table_row_content = "";
				$(service_availability_table).children("tbody").children("tr").not("tr:nth-child(1)").each(function() {
					var start_time = new Date("1970/01/01 " + $(this).children("td:nth-child(2)").find("input").val());
					var end_time = new Date("1970/01/01 " + $(this).children("td:nth-child(4)").find("input").val());
					var timer = start_time;
					var slot_in_words = convert_to_12_hr_format(timer);
					timer.setMinutes(timer.getMinutes() + service_time);
					while(timer <= end_time) {
						slot_table_row_content += "<tr><td>"+slot_number+".</td><td>"+slot_in_words+"</td><td>"+convert_to_12_hr_format(timer)+"</td></tr>";
						slot_number++;
						slot_in_words = convert_to_12_hr_format(timer);							
						timer.setMinutes(timer.getMinutes() + service_time);
					}
				});
				$(slot_table_tbody).append(slot_table_row_content);
				$("#slot_viewer select").val("all").change();
			}
		}
		else{  //view description was clicked
			var grand_parent_row = $(this).parents("tr");
			var service_name = $(grand_parent_row).children("td:nth-child(2)").text();
			$("#service_description_viewer_service_name").text(service_name);
			check_length($("#service_description_viewer textarea"));
		}
  	});
    $("#slot_viewer select").change(function(){
		$(".slot_viewer_slot_table,#slot_viewer_error").hide();
		$(".slot_viewer_slot_table tbody:eq(1),.slot_viewer_slot_table tbody:eq(2)").html("");
		if($(this).val() != "all"){
			var lower_time = Date.parse("1970/01/01 9:00 AM") + parseInt($(this).val()) * 10800000;
			var upper_time = lower_time + 10800000;
			var start_time;
			var current_table = $(".slot_viewer_slot_table:eq(1) tbody");
			var slot_table_row_content = "";
			var slot_number = 0;
			var valid_number_of_slots = 0;
			$(".slot_viewer_slot_table:eq(0) tbody").children("tr").each(function() {
				slot_number++;
				start_time = Date.parse("1970/01/01 " + $(this).children("td:nth-child(2)").text());
				if(start_time >= lower_time && start_time < upper_time){
					valid_number_of_slots++;
					if(valid_number_of_slots == 10){
						$(current_table).append(slot_table_row_content);
						current_table = $(".slot_viewer_slot_table:eq(2) tbody");
						slot_table_row_content = "";
					}
					slot_table_row_content += "<tr><td>"+slot_number+".</td><td>"+$(this).children("td:nth-child(2)").text()+"</td><td>"+$(this).children("td:nth-child(3)").text()+"</td></tr>";
				}
				else if(start_time >= upper_time)
					return false;
			});
			if(valid_number_of_slots > 0){
				$(current_table).append(slot_table_row_content);
				$(".slot_viewer_slot_table:eq(1)").show();
				if(valid_number_of_slots > 9)
					$(".slot_viewer_slot_table:eq(2)").show();
			}
			else
				$("#slot_viewer_error").show();
		}
		else{
			$(".slot_viewer_slot_table:eq(0)").show();
		}
	});
	var description_before_edit; //needed to restore service description when "Cancel" is clicked
	$(".service_description_viewer_button:eq(1)").click(function(){
		if($(this).text() == "Edit"){ //button was clicked in "Edit" state
			description_before_edit = $(this).siblings("textarea").val();
			$(this).siblings("textarea").prop("disabled",false);
			$(".service_description_viewer_button:eq(0)").prop("disabled",false);
			$(this).text("Cancel");
		}
		else{ //button was clicked in "Cancel" state
			$(this).siblings("textarea").val(description_before_edit);
			check_length($(this).siblings("textarea"));
			$(this).siblings("textarea,button").prop("disabled",true);
			$(this).text("Edit");
		}
	});
	$(".service_description_viewer_button:eq(0)").click(function(){
		$(".service_description_viewer_button:eq(1)").text("Edit");
		$(this).siblings("textarea").andSelf().prop("disabled",true);
	});

});
function services_offered_error(element,direct_call) {
	var input_type = $(element).attr("class").charAt(0);
	if(input_type=='n'){// if it is a "NUMBER" spinner
		if($(element).val()=="")
			$(element).parent().next().text("This field is required.");
		else{
			var input_value = parseInt($(element).val());
			var max_value = $(element).attr("max");
			var min_value = $(element).attr("min");
			if(input_value >= min_value && input_value <= max_value)
				$(element).parent().next().text("");
			else
				$(element).parent().next().text("Select within range.");
		}
	}
	else{// if it is a "TIME" spinner
		var grand_parent_row = $(element).parents("tr:last");
		var service_time_spinner = $(grand_parent_row).children("td:nth-child(3)").find("input");
		if($(service_time_spinner).val()=="") {
			if(direct_call == 1)
				$(service_time_spinner).focus();
			$(service_time_spinner).parent().next().text("Select service time first.");
		}
		else if($(element).val()=="")
			$(element).parent().next().text("This field is required.");
		else{
			var time_pattern = /^(?:[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/;
			var valid_time = time_pattern.test($(element).val());
			if(valid_time){ // if time entered is valid
				$(element).parent().next().text("");
				var spinner_index = $(".time_spinner").index($(element));
				if(spinner_index % 2 == 1) { // if the blurred timer is for " ends at "
					var start_spinner = $(".time_spinner:eq("+(spinner_index-1)+")");
					if(start_spinner.val()=="") { // if the start time is not entered
						if(direct_call == 1)
							start_spinner.focus();
						start_spinner.parent().next().text("Select start time first.");
					}
					else { // if start time is entered
						var start_time = Date.parse("1970/01/01 "+start_spinner.val());
						var end_time = Date.parse("1970/01/01 "+$(element).val());
						if(end_time <= start_time){
							$(element).parent().next().text("Should be higher.");
							alert("End time cannot be before (or same as) Start time!");
						}
						else{//if end time > start time
							var service_time = parseInt($(service_time_spinner).val());
							var difference_between_start_and_end_in_minutes =  (end_time-start_time)/60000;
							if(difference_between_start_and_end_in_minutes < service_time){
								$(element).parent().next().text("Should be higher.");
								alert("Difference between start and end of service availability should be at least "+service_time+" minutes!");
							}
						}
					}
				}
				else { // if the blurred timer is for " starts at "
					var number_of_slots = $(element).parents("tr:first").siblings().length; //stores no.of slots
                    var row_index = $(element).parents("tr:first").index(); //child number of corresponding row in service availability table
					var start_time = Date.parse("1970/01/01 "+$(element).val());
					var check_for_end_time = 0;
					if(number_of_slots > 1 && row_index != 1){ // if more than one slots are provided in service availability table and we're at extra availability rows added
						var previous_end_spinner = $(".time_spinner:eq("+(spinner_index-1)+")");
						var previous_end_time = Date.parse("1970/01/01 "+previous_end_spinner.val());
						if(start_time <= previous_end_time){
							$(element).parent().next().text("Slot overlaps.");
							alert("New slot should start after the end time of previous slot.");
						}
						else
							check_for_end_time = 1;
					}
					var end_spinner = $(".time_spinner:eq("+(spinner_index+1)+")");
					if((number_of_slots == 1 || check_for_end_time == 1) && end_spinner.val()!=""){
						var end_time = Date.parse("1970/01/01 "+end_spinner.val());
						if(start_time >= end_time){
							$(element).parent().next().text("Should be lower.");
							alert("Start time cannot be after (or same as) End time!");
						}
						else{//if start time < end time
							var service_time = parseInt($(service_time_spinner).val());
							var difference_between_start_and_end_in_minutes =  (end_time-start_time)/60000;
							if(difference_between_start_and_end_in_minutes < service_time){
								$(element).parent().next().text("Should be lower.");
								alert("Difference between start and end of service availability should be at least "+service_time+" minutes!");
							}
						}
					}
				}
			}
			else
				$(element).parent().next().text("Invalid time format.");
		}
	}
}
function add_slot(element) {
	var row_count = $(element).parents(".service_availability_table tbody").children("tr").length;
	if(row_count <= 5) {
		var table = $(element).parents(".service_availability_table");
		var new_row = '<tr><td>'+row_count+'.</td><td><div class="div_height_15"></div><input class="time_spinner" onBlur="services_offered_error(this,1)"><div class="error_message div_height_15"></div></td><td>to</td><td><div class="div_height_15"></div><input class="time_spinner" onBlur="services_offered_error(this,1)"><div class="error_message div_height_15"></div></td><td><img src="http://i.imgur.com/Q2FFDMq.png" onClick="remove_slot(this)"></td></tr>';
		table.append(new_row);
		$( ".time_spinner" ).timespinner();
	}
	else
		alert("You can add a maximum of 5 slots!");
}
function remove_slot(element) {
	var row_count = $(element).parents(".service_availability_table tbody").children("tr").length;
	if(row_count > 2) {
		var row_renamer = $(element).parent().parent().children("td:first-child").text().charAt(0);
		$(element).parent().parent().nextAll("tr").each(function() {
			$(this).children("td:first-child").text(row_renamer + ".");
			row_renamer++;
		});
		$(element).parent().parent().remove();
	}
	else
		alert("You must provide at least one slot!");
}
function convert_to_12_hr_format(date) {
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var ampm = hours >= 12 ? 'PM' : 'AM';
	hours = hours % 12;
	hours = hours ? hours : 12; // the hour '0' should be '12'
	minutes = minutes < 10 ? '0'+minutes : minutes;
	var strTime = hours + ':' + minutes + ' ' + ampm;
	return strTime;
}
function check_length(element) {
	if($(element).val().length > 500){
		$(element).val($(element).val().substr(0,500));
		return false;
	}
	$("#service_description_viewer_characters_left").text(500 - $(element).val().length);
	return true;
}
$.widget( "ui.timespinner", $.ui.spinner, {
  options: {
	// seconds
	step: 60 * 1000,
	// hours
	page: 60
  },
	 
  _parse: function( value ) {
	if ( typeof value === "string" ) {
// already a timestamp
if ( Number( value ) == value ) {
  return Number( value );
}
return +Globalize.parseDate( value );
	}
	return value;
  },
	 
  _format: function( value ) {
	return Globalize.format( new Date(value), "t" );
  }
});
	 
$(function() {
  $( ".time_spinner" ).timespinner();
  $( ".number_spinner" ).spinner();
});

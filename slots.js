#code for generating slots
$(document).ready(function() {
	alert();
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
			$("#service_charges_table tbody tr:nth-child("+row_number+") td:nth-child(5) input").prop("checked",false);;
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
			$("#service_description_viewer_service_name").text(service_name)
			check_length($("#service_description_viewer textarea"));
		}
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
					var start_time = Date.parse("1970/01/01 "+$(element).val());
					var check_for_end_time = 0;
					if(number_of_slots > 1){ // if more than one slots are provided in service availability table
						var previous_end_spinner = $(".time_spinner:eq("+(spinner_index-1)+")");
						var previous_end_time = Date.parse("1970/01/01 "+previous_end_spinner.val());
						if(start_time <= previous_end_time){
							$(element).parent().next().text("Slot overlaps.");
							alert("New slot should start after the end time of previous slot.")
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

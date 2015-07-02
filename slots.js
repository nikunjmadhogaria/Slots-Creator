#code for generating slots
$(document).ready(function() {
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

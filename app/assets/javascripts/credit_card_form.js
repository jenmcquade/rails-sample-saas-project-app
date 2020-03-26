$(document).on('ready', function() {
  var getURLParameter, show_error, stripeResponseHandler, submitHandler, handlePlanChange;

  // Get params from URL
  getURLParameter = function(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for(var i = 0; i < sURLVariables.length; i++) {
      var sParameterName = sURLVariables[i].split('=');
      if(sParameterName[0] == sParam) {
        return sParameterName[1];
      }
    }
  }

  submitHandler = function (event) {
    var $form = $(event.target);
    $form.find("input[type=submit]").prop("disabled", true);
    //If Stripe was initialized correctly this will create a token using the credit card info
    if(Stripe){
      Stripe.card.createToken($form, stripeResponseHandler);
    } else {
      show_error("Failed to load credit card processing functionality. Please reload this page in your browser.")
    }
    return false;
  };

  stripeResponseHandler = function (status, response) {
    var token, $form;
    $form = $('.cc_form');
    if (response.error) {
      console.log(response.error.message);
      show_error(response.error.message);
      $form.find("input[type=submit]").prop("disabled", false);
    } else {
      token = response.id;
      $form.append($("<input type=\"hidden\" name=\"payment[token]\" />").val(token));
      $("[data-stripe=number]").remove();
      $("[data-stripe=cvc]").remove();
      $("[data-stripe=exp-year]").remove();
      $("[data-stripe=exp-month]").remove();
      $("[data-stripe=label]").remove();
      $form.get(0).submit();
    }
    return false;
  };
  
  show_error = function (message) {
    if($("#flash-messages").length < 1){
      $("div.container.main").prepend("<div id='flash-messages'></div>")
    }
    $("#flash-messages").html('<div class="alert alert-warning"><a class="close" data-dismiss="alert">×</a><div id="flash_alert">' + message + '</div></div>');
    $(".alert").delay(5000).fadeOut(3000);
    return false;
  };

  // Handle event of plan drop down changing
  var handlePlanChange = function(plan_type, form) {
    var $form = $(form);
    
    if(plan_type == undefined) {
      plan_type = $('#tenant_plan :selected').val();
    }

    if(plan_type === 'premium') {
      $('[data-stripe]').prop('required', true);
      $form.off('submit');
      $form.on('submit', submitHandler);
      $('[data-stripe]').show();
    } else {
      $('[data-stripe]').hide();
      $form.off('submit');
      $('[data-stripe]').removeProp('required');
    }
  }

  // Setup plan change event listener #tenant_plan_id in the forms for class cc_form
  $('#tenant_plan').on('change', function(event) {
    handlePlanChange($('#tenant_plan :selected').val(), '.cc_form')
  });

  // Reset form submission to use submitHandler defined above
  $(".cc_form").on('submit', submitHandler);

  // Call plan change handler so that the plan is set correctly in the dropdown when the page loads
  handlePlanChange(getURLParameter('plan'), ".cc_form");

});
var stripe = Stripe('pk_test_ZzseJ5AKayP7TCPFgmeabT0v');
var elements = stripe.elements();

$(function() {
    $('.pay_result').hide();   
    $('.cssload-box-loading').hide();
});
var card = elements.create('card', {
  hidePostalCode: true,
  style: {
    base: {
      iconColor: '#F99A52',
      color: '#32315E',
      lineHeight: '48px',
      fontWeight: 400,
      fontFamily: '"Helvetica Neue", "Helvetica", sans-serif',
      fontSize: '15px',

      '::placeholder': {
        color: '#CFD7DF',
      }
    },
  }
});
card.mount('#card-element');

function setOutcome(result) {
  var successElement = document.querySelector('.success');
  var errorElement = document.querySelector('.error');
  successElement.classList.remove('visible');
  errorElement.classList.remove('visible');

  if (result.token) {
    // Use the token to create a charge or a customer
    // https://stripe.com/docs/charges
    successElement.querySelector('.token').textContent = result.token.id;
    successElement.classList.add('visible');
    $.ajax({                                                                                                                                          
        url: '/checkout',                                                                                                                             
        type: 'POST',                                                                                                                                 
        data: {                                                                                                                                       
            action: 'charge',                                                                                                                         
            stripeToken: result.token.id                                                                                                                     
        },                                                                                                                                            
        success: function(data) {    
           $('.cssload-box-loading').hide();
           $('.pay_result').show();                                                                                                                 
           if (data.paid) {
                $('.pay_result_success').show();
                $('.pay_result_error').hide();
           }  else{
                $('.pay_result_success').hide();
                $('.pay_result_error').show();
           }                                                                                                               
        }                                                                                                                                             
    })  
  } else if (result.error) {
    errorElement.textContent = result.error.message;
    errorElement.classList.add('visible');
  }
}

card.on('change', function(event) {
  setOutcome(event);
});

document.querySelector('form').addEventListener('submit', function(e) {
  e.preventDefault();
  $('.cssload-box-loading').show();
  var form = document.querySelector('form');
  var extraDetails = {
    name: form.querySelector('input[name=cardholder-name]').value,
    address_zip: form.querySelector('input[name=address-zip]').value
  };
  stripe.createToken(card, extraDetails).then(setOutcome);
});

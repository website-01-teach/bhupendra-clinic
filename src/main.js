document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('appointmentForm');
  const submitBtn = document.getElementById('submitBtn');
  const btnText = document.getElementById('btnText');
  const btnSpinner = document.getElementById('btnSpinner');
  const formMessage = document.getElementById('formMessage');

  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    // Show loading state
    submitBtn.disabled = true;
    btnText.classList.add('hidden');
    btnSpinner.classList.remove('hidden');
    formMessage.style.display = 'none';
    formMessage.className = 'form-message';

    // Get form data
    const formData = {
      fullName: document.getElementById('fullName').value.trim(),
      email: document.getElementById('email').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      serviceInterest: document.getElementById('serviceInterest').value,
      message: document.getElementById('message').value.trim()
    };

    try {
      // Use absolute URL for Vercel
      const apiUrl = window.location.origin + '/api/appointment';

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        formMessage.textContent = '✅ Appointment request submitted successfully! We will contact you soon.';
        formMessage.classList.add('success');
        form.reset();
      } else {
        formMessage.textContent = '❌ ' + (data.error || 'Something went wrong. Please try again.');
        formMessage.classList.add('error');
      }
    } catch (error) {
      console.error('Error:', error);
      formMessage.textContent = '❌ Network error. Please check your connection and try again.';
      formMessage.classList.add('error');
    } finally {
      // Reset button state
      submitBtn.disabled = false;
      btnText.classList.remove('hidden');
      btnSpinner.classList.add('hidden');
    }
  });
});

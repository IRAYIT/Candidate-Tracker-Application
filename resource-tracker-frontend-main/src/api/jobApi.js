const BASE_URL = 'http://localhost:8098';

export async function fetchOpeningByKey(publicUrlKey) {
  const response = await fetch(`${BASE_URL}/api/v1/openings/public/${publicUrlKey}`);
  if (!response.ok) {
    throw new Error(`Opening not found (status ${response.status})`);
  }
  return response.json();
}

export async function submitApplication(publicUrlKey, formFields, cvFile) {

  // Backend expects all form fields as a JSON string in "payload" parameter
  const payload = JSON.stringify({
    firstName:         formFields.firstName,
    lastName:          formFields.lastName,
    email:             formFields.email,
    phone:             formFields.phone,
    location:          formFields.location,
    experience:        formFields.experience,
    expectedSalary:    formFields.expectedSalary,
    languagesKnown:    formFields.languagesKnown,
    noticePeriod:      formFields.noticePeriod,
    visaStatus:        formFields.visaStatus,
    applicationStatus: formFields.applicationStatus,
    employmentType:    formFields.employmentType,
    source:            formFields.source,
  });

  const formData = new FormData();
  formData.append('payload', payload);   // ← JSON string
  formData.append('cv', cvFile);         // ← file parameter name is "cv"

  const response = await fetch(
    `${BASE_URL}/api/public/apply/${publicUrlKey}`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Submission failed (status ${response.status})`);
  }
  return response;
}
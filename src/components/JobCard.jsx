import React, { useState } from 'react';

const JobCard = ({ job, organizer, userType }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
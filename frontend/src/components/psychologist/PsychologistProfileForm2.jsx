import React, { useState } from 'react';
import axios from 'axios';

const PsychologistProfileForm = () => {
    const [formData, setFormData] = useState({
        user: '', // This should be the user ID
        profile_image: null,
        date_of_birth: '',
        gender: '',
        mobile_number: '',
        about_me: '',
        qualification: '',
        experience: '',
        specialization: '',
        fees: '',
        id_card: null,
        education_certificate: null,
        experience_certificate: null,
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.files[0],
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        for (const key in formData) {
            data.append(key, formData[key]);
        }

        try {
            const response = await axios.post('/api/psychologist/register/', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Registration successful:', response.data);
        } catch (error) {
            console.error('Registration failed:', error.response.data);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="file" name="profile_image" onChange={handleFileChange} />
            <input type="date" name="date_of_birth" onChange={handleChange} />
            <select name="gender" onChange={handleChange}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Unspecified">Unspecified</option>
            </select>
            <input type="text" name="mobile_number" onChange={handleChange} />
            <textarea name="about_me" onChange={handleChange} />
            <input type="text" name="qualification" onChange={handleChange} />
            <input type="number" name="experience" onChange={handleChange} />
            <input type="text" name="specialization" onChange={handleChange} />
            <input type="number" name="fees" onChange={handleChange} />
            <input type="file" name="id_card" onChange={handleFileChange} />
            <input type="file" name="education_certificate" onChange={handleFileChange} />
            <input type="file" name="experience_certificate" onChange={handleFileChange} />
            <button type="submit">Register</button>
        </form>
    );
};

export default PsychologistProfileForm;
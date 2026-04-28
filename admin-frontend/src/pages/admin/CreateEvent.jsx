import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Paper,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import AdminLayout from "../../components/admin/AdminLayout";
import { createAdminEvent } from "../../api/admin.events.api";

const CreateEvent = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    objective: "",
    category_id: "",
    location: "",
    start_date: "",
    end_date: "",
    capacity: "",
    price: "",
    price_includes: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    setImage(file || null);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        formData.append(key, String(value));
      }
    });

    if (image) {
      formData.append("image", image);
    }

    try {
      await createAdminEvent(formData);
      navigate("/admin/events");
    } catch (err) {
      console.error(err);
      alert("Failed to create event");
    }
  };

  return (
    <AdminLayout>
      <Typography variant="h4" fontWeight={800} mb={3}>
        Create New Event
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* IMAGE */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography fontWeight={700} mb={2}>
                Event Image
              </Typography>

              {preview && (
                <Box
                  sx={{
                    height: 200,
                    mb: 2,
                    borderRadius: 2,
                    background: `url(${preview}) center / cover`,
                  }}
                />
              )}

              <input type="file" accept="image/*" onChange={handleImageChange} />
            </Paper>
          </Grid>

          {/* DETAILS */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography fontWeight={800} mb={2}>
                Event Details
              </Typography>

              <TextField
                label="Title"
                name="title"
                fullWidth
                required
                margin="normal"
                onChange={handleChange}
              />

              <TextField
                label="Description"
                name="description"
                fullWidth
                multiline
                rows={4}
                margin="normal"
                onChange={handleChange}
              />

              <TextField
                label="Objective"
                name="objective"
                fullWidth
                margin="normal"
                onChange={handleChange}
              />

              <Divider sx={{ my: 3 }} />

              <TextField
                label="Category ID"
                name="category_id"
                fullWidth
                required
                margin="normal"
                onChange={handleChange}
              />

              <TextField
                label="Location"
                name="location"
                fullWidth
                margin="normal"
                onChange={handleChange}
              />

              <TextField
                label="Start Date"
                name="start_date"
                type="datetime-local"
                fullWidth
                InputLabelProps={{ shrink: true }}
                margin="normal"
                onChange={handleChange}
              />

              <TextField
                label="End Date"
                name="end_date"
                type="datetime-local"
                fullWidth
                InputLabelProps={{ shrink: true }}
                margin="normal"
                onChange={handleChange}
              />

              <TextField
                label="Capacity"
                name="capacity"
                type="number"
                fullWidth
                margin="normal"
                onChange={handleChange}
              />

              <Divider sx={{ my: 3 }} />

              <Typography fontWeight={800} mb={1}>
                Pricing
              </Typography>

              <TextField
                label="Price"
                name="price"
                type="number"
                fullWidth
                required
                margin="normal"
                inputProps={{ min: 0, step: 0.01 }}
                onChange={handleChange}
                helperText="Enter the amount only (currency will be displayed on client side)"
              />

              <TextField
                label="Price Includes"
                name="price_includes"
                fullWidth
                margin="normal"
                multiline
                rows={2}
                placeholder="e.g. VIP access, valet parking, welcome drink, private lounge..."
                onChange={handleChange}
              />
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Button type="submit" variant="contained" size="large">
              Create Event
            </Button>
          </Grid>
        </Grid>
      </form>
    </AdminLayout>
  );
};

export default CreateEvent;

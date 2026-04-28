import { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import AdminLayout from "../../components/admin/AdminLayout";
import { getAdminEvents, updateAdminEvent } from "../../api/admin.events.api";
import api from "../../api/axios";

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getAdminEvents();
        const list = res?.data?.data || res?.data || [];
        const ev = list.find((e) => String(e.ID) === String(id));

        if (!ev) return navigate("/admin/events");

        setForm({
          title: ev.TITLE || "",
          description: ev.DESCRIPTION || "",
          objective: ev.OBJECTIVE || "",
          category_id: ev.CATEGORY_ID ?? "",
          location: ev.LOCATION || "",
          start_date: ev.START_DATE
            ? String(ev.START_DATE).slice(0, 16)
            : "",
          end_date: ev.END_DATE
            ? String(ev.END_DATE).slice(0, 16)
            : "",
          capacity: ev.CAPACITY ?? "",
          price: ev.PRICE ?? "",
          price_includes: ev.PRICE_INCLUDES || "", // ✅ NEW
          image_url: ev.IMAGE_URL || "",
        });

        if (ev.IMAGE_URL) {
          setPreview(`${api.defaults.baseURL}${ev.IMAGE_URL}`);
        }
      } catch (e) {
        console.error(e);
        setError("Failed to load event");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, navigate]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    setImage(file || null);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    Object.entries(form).forEach(([k, v]) => {
      if (k === "image_url") return;
      if (v === null || v === undefined || v === "") return;
      formData.append(k, String(v));
    });

    if (image) formData.append("image", image);

    try {
      await updateAdminEvent(id, formData);
      navigate("/admin/events");
    } catch (e2) {
      console.error(e2);
      setError("Update failed");
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!form) return <Alert severity="info">No data.</Alert>;

  return (
    <AdminLayout>
      <Typography variant="h4" mb={3}>
        Edit Event
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              {preview && (
                <Box
                  sx={{
                    height: 180,
                    mb: 2,
                    borderRadius: 2,
                    background: `url(${preview}) center / cover`,
                  }}
                />
              )}
              <input type="file" accept="image/*" onChange={handleImageChange} />
            </Paper>
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <TextField
                label="Title"
                name="title"
                fullWidth
                margin="normal"
                value={form.title}
                onChange={handleChange}
              />
              <TextField
                label="Description"
                name="description"
                fullWidth
                multiline
                rows={4}
                margin="normal"
                value={form.description}
                onChange={handleChange}
              />
              <TextField
                label="Objective"
                name="objective"
                fullWidth
                margin="normal"
                value={form.objective}
                onChange={handleChange}
              />
              <TextField
                label="Category ID"
                name="category_id"
                fullWidth
                margin="normal"
                value={form.category_id}
                onChange={handleChange}
              />
              <TextField
                label="Location"
                name="location"
                fullWidth
                margin="normal"
                value={form.location}
                onChange={handleChange}
              />
              <TextField
                label="Start Date"
                name="start_date"
                type="datetime-local"
                fullWidth
                InputLabelProps={{ shrink: true }}
                margin="normal"
                value={form.start_date}
                onChange={handleChange}
              />
              <TextField
                label="End Date"
                name="end_date"
                type="datetime-local"
                fullWidth
                InputLabelProps={{ shrink: true }}
                margin="normal"
                value={form.end_date}
                onChange={handleChange}
              />
              <TextField
                label="Capacity"
                name="capacity"
                type="number"
                fullWidth
                margin="normal"
                value={form.capacity}
                onChange={handleChange}
              />
              <TextField
                label="Price (USD)"
                name="price"
                type="number"
                fullWidth
                margin="normal"
                inputProps={{ min: 0, step: 0.01 }}
                value={form.price}
                onChange={handleChange}
              />

              {/* ✅ PRICE INCLUDES */}
              <TextField
                label="Price Includes"
                name="price_includes"
                fullWidth
                margin="normal"
                value={form.price_includes}
                onChange={handleChange}
              />
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Button type="submit" variant="contained">
              Save Changes
            </Button>
          </Grid>
        </Grid>
      </form>
    </AdminLayout>
  );
};

export default EditEvent;

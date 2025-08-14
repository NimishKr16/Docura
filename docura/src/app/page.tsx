"use client";

import {
  alpha,
  Box,
  Button,
  Typography,
  useTheme,
  Card,
  Grid,
  CardActionArea,
  CardContent,
  Paper,
  Container,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import {
  FolderOpen,
  ViewList,
  ViewModule,
  Description,
} from "@mui/icons-material";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [loadingOpen, setLoadingOpen] = useState(false); // Track document opening state
  const router = useRouter();
  const theme = useTheme();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        window.location.href = "/login";
      } else {
        setUser(user);
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (user) {
      setLoadingDocs(true);
      supabase
        .from("Document")
        .select("*")
        .eq("ownerId", user.id)
        .order("updatedAt", { ascending: false })
        .then(({ data, error }) => {
          if (error) {
            console.error("Error fetching documents:", error);
            toast.error("Failed to load documents.");
          } else if (data) {
            setDocuments(data);
          }
          setLoadingDocs(false);
        });
    }
  }, [user]);

  if (loading) {
    return null;
  }

  const handleNewDocument = async () => {
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();
    if (!currentUser) {
      toast.error("You must be logged in to create a document.");
      return;
    }
    const { data, error } = await supabase
      .from("Document")
      .insert([
        { title: "Untitled Document", content: {}, ownerId: currentUser.id },
      ])
      .select()
      .single();
    if (error) {
      console.error("Error creating document:", error);
      toast.error("Failed to create document.");
      return;
    }
    if (data && data.id) {
      router.push(`/document/${data.id}`);
    }
  };

  const handleOpenDocument = (id: string) => {
    setLoadingOpen(true);
    router.push(`/document/${id}`);
    // Optionally, reset loadingOpen after a short delay
    setTimeout(() => setLoadingOpen(false), 2000);
    // If using Next.js router events, you could add listeners for route change complete/error to clear loadingOpen
  };

  if (user) {
    return (
      <div>
        <Navbar />
        {/* Overlay Loader for Opening Document */}
        {loadingOpen && (
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              bgcolor: "rgba(255,255,255,0.75)",
              zIndex: 2000,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress size={50} sx={{ color: "#1a1a1a", mb: 3 }} />
            <Typography variant="h6" sx={{ color: "#1a1a1a", fontWeight: 600 }}>
              Opening document...
            </Typography>
          </Box>
        )}

        {/* Main Content Area */}
        <Box
          sx={{
            pt: "80px",
            minHeight: "calc(100vh - 80px)",
            background: "#fafbfc",
          }}
        >
          <Container maxWidth="xl" sx={{ py: 4 }}>
            {/* Header Section */}
            <Box sx={{ mb: 6 }}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  color: "#1a1a1a",
                  fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                  lineHeight: 1.1,
                  mb: 1,
                }}
              >
                Your Documents
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: "#6b7280",
                  fontWeight: 400,
                  fontSize: { xs: "1rem", sm: "1.1rem" },
                }}
              >
                Create, edit, and collaborate on documents
              </Typography>
            </Box>

            {/* Quick Actions Bar */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                mb: 4,
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: 3,
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
              }}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                flexWrap="wrap"
                gap={2}
              >
                <Box display="flex" alignItems="center" gap={2}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleNewDocument}
                    startIcon={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                        </svg>
                      </Box>
                    }
                    sx={{
                      py: 1.5,
                      px: 3,
                      fontSize: "1rem",
                      fontWeight: 600,
                      textTransform: "none",
                      borderRadius: 2,
                      background: "#1a1a1a",
                      color: "white",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        background: "#2d2d2d",
                        transform: "translateY(-1px)",
                        boxShadow: "0 6px 20px rgba(0, 0, 0, 0.2)",
                      },
                    }}
                  >
                    New Document
                  </Button>

                  <Button
                    variant="outlined"
                    startIcon={<FolderOpen />}
                    sx={{
                      textTransform: "none",
                      borderColor: "#e5e7eb",
                      color: "#6b7280",
                      "&:hover": {
                        borderColor: "#d1d5db",
                        background: "#f9fafb",
                      },
                    }}
                  >
                    Import
                  </Button>
                </Box>

                <Box display="flex" alignItems="center" gap={1}>
                  <IconButton
                    sx={{
                      background: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      "&:hover": { background: "#f1f5f9" },
                    }}
                  >
                    <ViewList />
                  </IconButton>
                  <IconButton
                    sx={{
                      background: "#1a1a1a",
                      color: "white",
                      "&:hover": { background: "#2d2d2d" },
                    }}
                  >
                    <ViewModule />
                  </IconButton>
                </Box>
              </Box>
            </Paper>

            {/* Documents Section */}
            <Box>
              {loadingDocs ? (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  py={8}
                >
                  <CircularProgress size={40} sx={{ color: "#1a1a1a" }} />
                  <Typography variant="body1" sx={{ ml: 2, color: "#6b7280" }}>
                    Loading your documents...
                  </Typography>
                </Box>
              ) : documents.length === 0 ? (
                <Paper
                  elevation={0}
                  sx={{
                    p: 8,
                    textAlign: "center",
                    background: "#ffffff",
                    border: "2px dashed #e5e7eb",
                    borderRadius: 3,
                  }}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      background: "#f3f4f6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 24px",
                    }}
                  >
                    <Description sx={{ fontSize: 40, color: "#9ca3af" }} />
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 600, mb: 1, color: "#374151" }}
                  >
                    No documents yet
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "#6b7280",
                      mb: 3,
                      maxWidth: "400px",
                      mx: "auto",
                    }}
                  >
                    Get started by creating your first document. You can write,
                    format, and share it with others.
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={handleNewDocument}
                    sx={{
                      background: "#1a1a1a",
                      color: "white",
                      textTransform: "none",
                      py: 1.5,
                      px: 3,
                      "&:hover": { background: "#2d2d2d" },
                    }}
                  >
                    Create Your First Document
                  </Button>
                </Paper>
              ) : (
                <>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    mb={3}
                  >
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 600, color: "#1a1a1a" }}
                    >
                      Recent Documents
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#6b7280" }}>
                      {documents.length} document
                      {documents.length !== 1 ? "s" : ""}
                    </Typography>
                  </Box>

                  <Grid container spacing={2}>
                    {/* Helper to extract plain text from TipTap JSON */}
                    {(() => {
                      function extractTextFromTipTap(node: any): string {
                        if (!node) return "";
                        let text = "";
                        if (Array.isArray(node)) {
                          for (const n of node) {
                            text += extractTextFromTipTap(n);
                          }
                        } else if (typeof node === "object") {
                          if (
                            node.type === "text" &&
                            typeof node.text === "string"
                          ) {
                            text += node.text;
                          }
                          if (Array.isArray(node.content)) {
                            text += extractTextFromTipTap(node.content);
                          }
                          // Some nodes may have children in other keys (e.g., marks), but for most TipTap docs, it's 'content'
                        }
                        return text;
                      }
                      return documents.map((doc) => {
                        const updatedDate = doc.updatedAt
                          ? new Date(doc.updatedAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )
                          : "";

                        let snippet = "";
                        let wordCount = 0;
                        let textContent = "";
                        try {
                          if (doc.content) {
                            if (typeof doc.content === "object") {
                              textContent = extractTextFromTipTap(doc.content);
                            } else if (typeof doc.content === "string") {
                              // fallback: treat as plain text
                              textContent = doc.content;
                            }
                          }
                          if (textContent && textContent.trim().length > 0) {
                            snippet =
                              textContent.slice(0, 120) +
                              (textContent.length > 120 ? "..." : "");
                            // Count words (split by whitespace)
                            wordCount = textContent
                              .trim()
                              .split(/\s+/)
                              .filter(Boolean).length;
                          } else {
                            snippet =
                              "This document is empty. Click to start writing.";
                            wordCount = 0;
                          }
                        } catch {
                          snippet = "Click to view document content";
                          wordCount = 0;
                        }

                        return (
                          <Grid item xs={12} sm={4} md={4} lg={4} key={doc.id}>
                            <Paper
                              elevation={0}
                              sx={{
                                background: "#ffffff",
                                border: "1px solid #e5e7eb",
                                borderRadius: 2,
                                overflow: "hidden",
                                width: "250px",
                                height: "250px",
                                margin: "0 auto",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                                transition: "all 0.2s cubic-bezier(.4,0,.2,1)",
                                cursor: "pointer",
                                "&:hover": {
                                  transform: "translateY(-4px)",
                                  boxShadow: "0 6px 24px rgba(0,0,0,0.10)",
                                  borderColor: "#d1d5db",
                                },
                              }}
                              onClick={() => handleOpenDocument(doc.id)}
                            >
                              {/* Document Content */}
                              <Box
                                sx={{
                                  px: 2.5,
                                  pt: 2.5,
                                  pb: 1.5,
                                  width: "100%",
                                  height: "100%",
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "flex-start",
                                  justifyContent: "flex-start",
                                }}
                              >
                                <Typography
                                  variant="h6"
                                  sx={{
                                    fontWeight: 700,
                                    color: "#1a1a1a",
                                    mb: 1,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    fontSize: "1rem",
                                    width: "100%",
                                  }}
                                >
                                  {doc.title || "Untitled Document"}
                                </Typography>

                                <Typography
                                  variant="body2"
                                  sx={{
                                    width: "100%",
                                    mb: 1.5,
                                    ...(snippet ===
                                    "This document is empty. Click to start writing."
                                      ? {
                                          fontStyle: "italic",
                                          fontSize: "0.9rem",
                                          color: "#9ca3af",
                                          textAlign: "center",
                                          lineHeight: 1.7,
                                          minHeight: 60,
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                        }
                                      : {
                                          color: "#6b7280",
                                          lineHeight: 1.4,
                                          minHeight: 60,
                                          display: "-webkit-box",
                                          WebkitLineClamp: 3,
                                          WebkitBoxOrient: "vertical",
                                          overflow: "hidden",
                                        }),
                                  }}
                                >
                                  {snippet}
                                </Typography>

                                <Box
                                  display="flex"
                                  justifyContent="space-between"
                                  alignItems="center"
                                  width="100%"
                                  mt="auto"
                                >
                                  <Typography
                                    variant="caption"
                                    sx={{ color: "#9ca3af" }}
                                  >
                                    {updatedDate}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    sx={{ color: "#9ca3af" }}
                                  >
                                    {wordCount} words
                                  </Typography>
                                </Box>
                              </Box>
                            </Paper>
                          </Grid>
                        );
                      });
                    })()}
                  </Grid>
                </>
              )}
            </Box>
          </Container>
        </Box>

        <ToastContainer />
      </div>
    );
  }

  return null;
}

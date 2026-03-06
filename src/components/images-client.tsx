"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Save, Trash2, X } from "lucide-react";
import {
  BooleanBadge,
  PageHeader,
  SurfaceCard,
} from "@/components/editorial-ui";
import { Pagination } from "@/components/pagination";
import { formatUtcDate } from "@/lib/date";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ImageRow = Record<string, any>;

interface ImageFormData {
  url: string;
  is_common_use: boolean;
  is_public: boolean;
  image_description: string;
  celebrity_recognition: string;
}

const emptyForm: ImageFormData = {
  url: "",
  is_common_use: false,
  is_public: false,
  image_description: "",
  celebrity_recognition: "",
};

export function ImagesClient({
  initialImages,
  error,
  currentPage,
  totalCount,
  pageSize,
}: {
  initialImages: ImageRow[];
  error?: string;
  currentPage: number;
  totalCount: number;
  pageSize: number;
}) {
  const router = useRouter();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ImageFormData>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const resetEditor = () => {
    setShowCreateForm(false);
    setEditingId(null);
    setFormData(emptyForm);
  };

  const handleCreate = async () => {
    if (!formData.url) return;

    setLoading(true);
    setActionError(null);

    try {
      const response = await fetch("/api/images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create image");
      }

      resetEditor();
      router.refresh();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: string) => {
    setLoading(true);
    setActionError(null);

    try {
      const response = await fetch(`/api/images/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update image");
      }

      resetEditor();
      router.refresh();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    setLoading(true);
    setActionError(null);

    try {
      const response = await fetch(`/api/images/${id}`, { method: "DELETE" });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete image");
      }

      router.refresh();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (image: ImageRow) => {
    setEditingId(image.id);
    setShowCreateForm(false);
    setFormData({
      url: image.url,
      is_common_use: image.is_common_use,
      is_public: image.is_public,
      image_description: image.image_description || "",
      celebrity_recognition: image.celebrity_recognition || "",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Images"
        meta={`${totalCount.toLocaleString()} total`}
        actions={
          <button
            onClick={() => {
              if (showCreateForm) {
                resetEditor();
                return;
              }

              setShowCreateForm(true);
              setEditingId(null);
              setFormData(emptyForm);
            }}
            className="button-primary flex cursor-pointer items-center gap-2 text-sm font-medium"
          >
            <Plus className="h-4 w-4" strokeWidth={1.8} />
            {showCreateForm ? "Close" : "Add image"}
          </button>
        }
      />

      {error ? (
        <div className="alert-error">{error}</div>
      ) : null}

      {actionError ? (
        <div className="alert-error">{actionError}</div>
      ) : null}

      {showCreateForm ? (
        <ImageForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleCreate}
          onCancel={resetEditor}
          loading={loading}
          title="Add image"
          description="Create a new image record."
        />
      ) : null}

      <SurfaceCard className="table-card">
        <div className="overflow-x-auto">
          <table className="data-table min-w-[1080px]">
            <thead>
              <tr className="text-left">
                {[
                  "Preview",
                  "URL",
                  "Description",
                  "Celebrity Recognition",
                  "Uploaded By",
                  "Public",
                  "Common",
                  "Created",
                  "Actions",
                ].map((label) => (
                  <th
                    key={label}
                    className={`${
                      label === "Public" || label === "Common" || label === "Actions"
                        ? "text-center"
                        : ""
                    }`}
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {initialImages.map((image) =>
                editingId === image.id ? (
                  <tr key={image.id} className="border-b border-[var(--line)]">
                    <td colSpan={9} className="px-5 py-5">
                      <ImageForm
                        formData={formData}
                        setFormData={setFormData}
                        onSubmit={() => handleUpdate(image.id)}
                        onCancel={resetEditor}
                        loading={loading}
                        title="Edit image"
                        description="Update image metadata."
                      />
                    </td>
                  </tr>
                ) : (
                  <tr key={image.id}>
                    <td>
                      {image.url ? (
                        // Remote preview URLs come from stored records, so plain img avoids allowlist churn.
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={image.url}
                          alt=""
                          className="h-14 w-14 rounded-[1rem] object-cover"
                        />
                      ) : (
                        <div className="h-14 w-14 rounded-[1rem] bg-white/55" />
                      )}
                    </td>
                    <td className="max-w-[160px] text-[var(--ink-soft)]">
                      <p className="truncate">{image.url}</p>
                    </td>
                    <td className="max-w-[180px] text-[var(--ink-soft)]">
                      <p className="line-clamp-2 leading-6">
                        {image.image_description || "-"}
                      </p>
                    </td>
                    <td className="max-w-[180px] text-[var(--ink-soft)]">
                      <p className="line-clamp-2 leading-6">
                        {image.celebrity_recognition || "-"}
                      </p>
                    </td>
                    <td className="whitespace-nowrap text-[var(--ink-soft)]">
                      {image.profiles
                        ? `${image.profiles.first_name || ""} ${image.profiles.last_name || ""}`.trim()
                        : "-"}
                    </td>
                    <td className="text-center">
                      <BooleanBadge active={image.is_public} />
                    </td>
                    <td className="text-center">
                      <BooleanBadge active={image.is_common_use} />
                    </td>
                    <td className="whitespace-nowrap text-[var(--ink-soft)]">
                      {formatUtcDate(image.created_datetime_utc)}
                    </td>
                    <td>
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => startEdit(image)}
                          className="soft-panel flex h-10 w-10 cursor-pointer items-center justify-center rounded-[0.95rem] text-[var(--ink-soft)] transition-colors hover:text-[var(--ink)]"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" strokeWidth={1.8} />
                        </button>
                        <button
                          onClick={() => handleDelete(image.id)}
                          className="soft-panel flex h-10 w-10 cursor-pointer items-center justify-center rounded-[0.95rem] text-[var(--ink-soft)] transition-colors hover:text-[#a26371]"
                          title="Delete"
                          disabled={loading}
                        >
                          <Trash2 className="h-4 w-4" strokeWidth={1.8} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )}
              {initialImages.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="py-14 text-center text-sm text-[var(--ink-soft)]"
                  >
                    No images found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </SurfaceCard>

      <Pagination
        currentPage={currentPage}
        totalCount={totalCount}
        pageSize={pageSize}
      />
    </div>
  );
}

function ImageForm({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  loading,
  title,
  description,
}: {
  formData: ImageFormData;
  setFormData: (data: ImageFormData) => void;
  onSubmit: () => void;
  onCancel: () => void;
  loading: boolean;
  title: string;
  description: string;
}) {
  return (
    <SurfaceCard className="rounded-[1.5rem] px-5 py-5 sm:px-6 sm:py-6">
      <div className="mx-auto max-w-[70rem]">
        <div className="max-w-2xl">
          <h3 className="display-title text-3xl">{title}</h3>
          <p className="body-copy mt-2 text-sm leading-6">{description}</p>
        </div>

        <div className="mt-6 grid gap-y-5 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-x-8 xl:grid-cols-[minmax(0,1fr)_19rem] xl:gap-x-10">
          <div className="lg:col-start-1 lg:row-start-1">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-[var(--ink-faint)]">
              URL *
            </label>
            <input
              type="text"
              value={formData.url}
              onChange={(event) =>
                setFormData({ ...formData, url: event.target.value })
              }
              className="field-input text-sm"
              placeholder="https://..."
            />
          </div>

          <div className="grid gap-5 lg:col-start-1 lg:row-start-2 lg:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-[var(--ink-faint)]">
                Image Description
              </label>
              <textarea
                value={formData.image_description}
                onChange={(event) =>
                  setFormData({ ...formData, image_description: event.target.value })
                }
                className="field-input min-h-[12rem] resize-none text-sm leading-6"
                placeholder="Describe the image..."
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-[var(--ink-faint)]">
                Celebrity Recognition
              </label>
              <textarea
                value={formData.celebrity_recognition}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    celebrity_recognition: event.target.value,
                  })
                }
                className="field-input min-h-[12rem] resize-none text-sm leading-6"
                placeholder="Add recognition notes..."
              />
            </div>
          </div>

          <div className="min-w-0 lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:self-stretch">
            <div className="min-h-[16rem] overflow-hidden rounded-[1.25rem] bg-white/70 shadow-[0_12px_28px_rgba(77,114,147,0.08)] lg:h-full lg:min-h-0">
              {formData.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={formData.url}
                  alt="Preview"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : (
                <div className="flex h-full min-h-[16rem] items-center justify-center px-6 text-center text-xs uppercase tracking-[0.2em] text-[var(--ink-faint)] lg:min-h-0">
                  Preview
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-4 pt-2 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-3">
            <label className="flex cursor-pointer items-center gap-3 rounded-[1.05rem] bg-white/72 px-4 py-3 text-sm text-[var(--ink-soft)] shadow-[0_10px_24px_rgba(77,114,147,0.06)]">
              <input
                type="checkbox"
                checked={formData.is_public}
                onChange={(event) =>
                  setFormData({ ...formData, is_public: event.target.checked })
                }
                className="h-4 w-4 rounded border-[var(--line-strong)] accent-[var(--accent)]"
              />
              Public
            </label>

            <label className="flex cursor-pointer items-center gap-3 rounded-[1.05rem] bg-white/72 px-4 py-3 text-sm text-[var(--ink-soft)] shadow-[0_10px_24px_rgba(77,114,147,0.06)]">
              <input
                type="checkbox"
                checked={formData.is_common_use}
                onChange={(event) =>
                  setFormData({ ...formData, is_common_use: event.target.checked })
                }
                className="h-4 w-4 rounded border-[var(--line-strong)] accent-[var(--accent)]"
              />
              Common use
            </label>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onCancel}
              className="button-secondary flex cursor-pointer items-center justify-center gap-2 text-sm font-medium"
            >
              <X className="h-4 w-4" strokeWidth={1.8} />
              Cancel
            </button>
            <button
              onClick={onSubmit}
              disabled={loading || !formData.url}
              className="button-primary flex cursor-pointer items-center justify-center gap-2 text-sm font-medium"
            >
              <Save className="h-4 w-4" strokeWidth={1.8} />
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </SurfaceCard>
  );
}

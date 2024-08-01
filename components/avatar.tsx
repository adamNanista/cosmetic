"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";

export default function Avatar({ uid, url, size, onUpload }: { uid: string | null; url: string | null; size: number; onUpload: (url: string) => void }) {
	const supabase = createClient();

	const [avatarUrl, setAvatarUrl] = useState<string | null>(url);
	const [uploading, setUploading] = useState(false);

	useEffect(() => {
		async function downloadImage(path: string) {
			try {
				const { data, error } = await supabase.storage.from("avatars").download(path);

				if (error) {
					console.log(error);
					throw error;
				}

				if (data) {
					const url = URL.createObjectURL(data);
					setAvatarUrl(url);
				}
			} catch (error) {
				console.log("Error downloading image: ", error);
			}
		}

		if (url) downloadImage(url);
	}, [url, supabase]);

	const uploadAvatar: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
		try {
			setUploading(true);

			if (!event.target.files || event.target.files.length === 0) {
				throw new Error("No images selected");
			}

			const file = event.target.files[0];
			const fileExt = file.name.split(".").pop();
			const filePath = `${uid}-${Math.random()}.${fileExt}`;

			const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file);

			if (uploadError) {
				throw uploadError;
			}

			onUpload(filePath);
		} catch (error) {
			alert("Error uploading image");
		} finally {
			setUploading(false);
		}
	};

	return (
		<div>
			{avatarUrl ? <Image width={size} height={size} src={avatarUrl} alt="Avatar" style={{ height: size, width: size }} /> : <div>No image</div>}
			<div style={{ width: size }}>
				<label htmlFor="single">{uploading ? "Uploading..." : "Upload"}</label>
				<input style={{ visibility: "hidden", position: "absolute" }} type="file" accept="image/*" id="single" onChange={uploadAvatar} disabled={uploading} />
			</div>
		</div>
	);
}

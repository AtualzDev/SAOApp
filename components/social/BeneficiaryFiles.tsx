import React, { useEffect, useState } from 'react';
import { Upload, File, FileText, Trash2, Download, Eye, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../../services/supabase';

interface BeneficiaryFilesProps {
    beneficiaryId: string;
}

const BeneficiaryFiles: React.FC<BeneficiaryFilesProps> = ({ beneficiaryId }) => {
    const [files, setFiles] = useState<any[]>([]);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFiles();
    }, [beneficiaryId]);

    const fetchFiles = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .storage
                .from('beneficiary-documents')
                .list(beneficiaryId + '/', {
                    limit: 100,
                    offset: 0,
                    sortBy: { column: 'name', order: 'asc' },
                });

            if (error) {
                // If bucket doesn't exist, it might error. For now, assume it might be empty.
                console.error('Error fetching files:', error);
                // Fallback or empty if bucket needs creation
            } else {
                setFiles(data || []);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const uploadFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${beneficiaryId}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('beneficiary-documents')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            await fetchFiles();
        } catch (error) {
            alert('Error uploading file!');
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    const deleteFile = async (fileName: string) => {
        if (!window.confirm("Tem certeza que deseja excluir este arquivo?")) return;

        try {
            const { error } = await supabase.storage
                .from('beneficiary-documents')
                .remove([`${beneficiaryId}/${fileName}`]);

            if (error) throw error;
            await fetchFiles();
        } catch (error) {
            console.error(error);
            alert("Erro ao deletar arquivo.");
        }
    }

    const getFileUrl = (fileName: string) => {
        const { data } = supabase.storage.from('beneficiary-documents').getPublicUrl(`${beneficiaryId}/${fileName}`);
        return data.publicUrl;
    }

    const formatBytes = (bytes: number, decimals = 2) => {
        if (!+bytes) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Arquivos e Documentos</h2>
                    <p className="text-sm text-slate-500">Gerencie documentos, laudos e fotos do beneficiário.</p>
                </div>
                <div className="relative">
                    <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        onChange={uploadFile}
                        disabled={uploading}
                    />
                    <label
                        htmlFor="file-upload"
                        className={`flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer font-bold text-sm ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                        {uploading ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Upload size={18} />
                        )}
                        {uploading ? 'Enviando...' : 'Novo Arquivo'}
                    </label>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {files.length === 0 && (
                        <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                            <FileText size={48} className="mb-4 text-slate-300" />
                            <p className="font-medium">Nenhum arquivo encontrado</p>
                            <p className="text-sm">Envie documentos para vê-los aqui.</p>
                        </div>
                    )}

                    {files.map((file) => (
                        <div key={file.id} className="group bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all relative">
                            <div className="flex items-start justify-between mb-3">
                                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
                                    {file.metadata?.mimetype?.includes('image') ? <ImageIcon size={20} /> : <FileText size={20} />}
                                </div>
                                <button
                                    onClick={() => deleteFile(file.name)}
                                    className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <h3 className="font-bold text-slate-700 text-sm truncate mb-1" title={file.name}>{file.name}</h3>
                            <p className="text-xs text-slate-400 mb-4">{formatBytes(file.metadata?.size)} • {new Date(file.created_at).toLocaleDateString()}</p>

                            <div className="flex gap-2">
                                <a
                                    href={getFileUrl(file.name)}
                                    target="_blank"
                                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-slate-50 text-slate-600 font-bold text-xs rounded-lg hover:bg-slate-100 transition-colors"
                                >
                                    <Eye size={14} /> Visualizar
                                </a>
                                <a
                                    href={getFileUrl(file.name)}
                                    download
                                    className="flex items-center justify-center w-8 py-2 bg-slate-50 text-slate-600 font-bold text-xs rounded-lg hover:bg-slate-100 transition-colors"
                                >
                                    <Download size={14} />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BeneficiaryFiles;

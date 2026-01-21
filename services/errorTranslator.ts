export const translateError = (errorMessage: string): string => {
    if (!errorMessage) return 'Ocorreu um erro desconhecido.';

    const normalizedError = errorMessage.toLowerCase();

    if (normalizedError.includes('invalid login credentials')) {
        return 'Email ou senha incorretos.';
    }
    if (normalizedError.includes('password should be at least 6 characters')) {
        return 'A senha deve ter pelo menos 6 caracteres.';
    }
    if (normalizedError.includes('user not found')) {
        return 'Usuário não encontrado.';
    }
    if (normalizedError.includes('user already registered')) {
        return 'Este email já está cadastrado.';
    }
    if (normalizedError.includes('email rate limit exceeded')) {
        return 'Limite de tentativas excedido. Tente novamente mais tarde.';
    }
    if (normalizedError.includes('captcha')) {
        return 'Erro de verificação. Tente novamente.';
    }
    if (normalizedError.includes('network request failed')) {
        return 'Erro de conexão. Verifique sua internet.';
    }
    if (normalizedError.includes('to signup, please provide your email')) {
        return 'Por favor, forneça um email válido.';
    }

    // Return the original if no match, or a generic one if you prefer avoiding English entirely.
    // Given user requirement "Avoid leaving ANY message in English", we should be aggressive.
    // But purely generic messages obscure the real issue. 
    // I will log the original and returns a generic fallback if cryptic.

    console.log('Untranslated error:', errorMessage);
    return 'Ocorreu um erro ao processar sua solicitação. Tente novamente.';
};

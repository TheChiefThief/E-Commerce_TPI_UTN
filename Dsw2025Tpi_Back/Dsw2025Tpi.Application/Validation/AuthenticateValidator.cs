using Dsw2025Tpi.Application.Dtos;
using Dsw2025Tpi.Application.Exceptions;
using System.Text.RegularExpressions;

namespace Dsw2025Tpi.Application.Validation
{
    public static class AuthenticateValidator
    {
        public static void ValidateLogin(LoginModel model)
        {
            if (model == null)
            {
                throw new InvalidCredentialsException("Los datos de login no pueden ser nulos.");
            }
            if (string.IsNullOrWhiteSpace(model.Username))
            {
                throw new InvalidCredentialsException("El nombre de usuario es requerido.");
            }
            if (string.IsNullOrWhiteSpace(model.Password))
            {
                throw new InvalidCredentialsException("La contraseña es requerida.");
            }
        }

        public static void ValidateRegister(RegisterModel model)
        {
            if (model == null)
            {
                throw new InvalidCredentialsException("Los datos de registro no pueden ser nulos.");
            }
            if (string.IsNullOrWhiteSpace(model.Username))
            {
                throw new InvalidCredentialsException("El nombre de usuario es requerido.");
            }
            if (string.IsNullOrWhiteSpace(model.Email))
            {
                throw new InvalidCredentialsException("El email es requerido.");
            }
            if (!Regex.IsMatch(model.Email, @"^[^@\s]+@[^@\s]+\.[^@\s]+$"))
            {
                throw new InvalidEmailFormatException("El formato del email no es válido.");
            }
            if (string.IsNullOrWhiteSpace(model.Password))
            {
                throw new InvalidCredentialsException("La contraseña es requerida.");
            }
            ValidatePassword(model.Password);
        }
        private static void ValidatePassword(string password)
        {
            if (string.IsNullOrEmpty(password) || password.Length < 8)
            {
                throw new WeakPasswordException("La contraseña debe tener al menos 8 caracteres.");
            }

            if (!Regex.IsMatch(password, "[a-z]"))
            {
                throw new WeakPasswordException("La contraseña debe tener al menos una letra minúscula.");
            }

            if (!Regex.IsMatch(password, "[A-Z]"))
            {
                throw new WeakPasswordException("La contraseña debe tener al menos una letra mayúscula.");
            }

            if (!Regex.IsMatch(password, "[0-9]"))
            {
                throw new WeakPasswordException("La contraseña debe tener al menos un número.");
            }

            if (!Regex.IsMatch(password, @"[!@#$%^&*()_+=\[{\]};:<>|./?,-]"))
            {
                throw new WeakPasswordException("La contraseña debe tener al menos un caracter especial.");
            }
        }
    }
}

using chat.Dtos;
using FluentValidation;

namespace chat.Validators;

public class RegisterDtoValidator: AbstractValidator<RegisterDto>
{
    public RegisterDtoValidator()
    {
        RuleFor(u => u.UserName)
            .NotEmpty()
            .MinimumLength(3).WithMessage("Длина имени не может быть меньше 3")
            .MaximumLength(20).WithMessage("Максимальная длина имени не больше 20 букв");

        RuleFor(u => u.Password)
            .NotEmpty()
            .MinimumLength(6).WithMessage("Пароль  должен быть не меньше 6 символов")
            .MaximumLength(100).WithMessage("Длина пароля не может превышать  100 символов");
    }
}

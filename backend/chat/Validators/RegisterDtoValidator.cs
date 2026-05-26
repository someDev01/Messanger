using chat.Dtos;
using FluentValidation;

namespace chat.Validators;

public class RegisterDtoValidator: AbstractValidator<RegisterDto>
{
    public RegisterDtoValidator()
    {
        RuleFor(u => u.UserName)
            .NotEmpty()
            .MinimumLength(3)
            .MaximumLength(20);

        RuleFor(u => u.Password)
            .NotEmpty()
            .MinimumLength(6);
    }
}

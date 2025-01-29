
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

const ResetPasswordForm = ({ switchToLogin }) => {
    return (
      <form>
        <div className="flex flex-col gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" required />
          </div>
          <Button type="submit" className="w-full">
            Reset Password
          </Button>
          <div className="mt-4 text-center text-sm">
            Remembered your password?{" "}
            <span onClick={switchToLogin} className="underline underline-offset-4 cursor-pointer">
              Login
            </span>
          </div>
        </div>
      </form>
    );
  };

  export default ResetPasswordForm;
  
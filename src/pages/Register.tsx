import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { Separator } from '@/components/ui/separator';
import { Linkedin, Mail, Lock, User, AlertTriangle, ShieldCheck } from 'lucide-react';
import ValidationUtils from '@/utils/validation';
import SecurityUtils from '@/utils/security';

// Use the validation schema from ValidationUtils
const formSchema = ValidationUtils.schemas.register;

const Register = () => {
  const navigate = useNavigate();
  const { register, loginWithGoogle, loginWithLinkedIn } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState<{ isValid: boolean; errors: string[] }>({
    isValid: false,
    errors: []
  });

  // Clear any previous registration errors when component mounts
  useEffect(() => {
    setRegisterError(null);
  }, []);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false
    }
  });

  const onSubmit = async (values: any) => {
    try {
      setIsSubmitting(true);
      setRegisterError(null);

      // Validate password strength
      const passwordValidation = SecurityUtils.validatePasswordStrength(values.password);
      if (!passwordValidation.isValid) {
        setPasswordStrength(passwordValidation);
        throw new Error('Password does not meet security requirements');
      }

      // Sanitize inputs to prevent XSS
      const sanitizedName = SecurityUtils.sanitizeInput(values.name);
      const sanitizedEmail = SecurityUtils.sanitizeInput(values.email);

      // Generate CSRF token for form submission
      SecurityUtils.generateCsrfToken();

      await register({ email: sanitizedEmail, password: values.password, name: sanitizedName });
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Registration failed:', error);
      setRegisterError(error?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg'>
        <div className='text-center'>
          <Link to='/' className='inline-block'>
            <h1 className='text-xl font-bold text-blue-700 tracking-tight mb-2'>Synapse</h1>
          </Link>
          <h2 className='text-2xl font-bold text-gray-900'>Create your account</h2>
          <p className='mt-2 text-sm text-gray-600'>
            Or{' '}
            <Link to='/login' className='font-medium text-blue-600 hover:text-blue-500'>
              sign in to your existing account
            </Link>
          </p>
        </div>

        <div className='flex flex-col space-y-4'>
          <Button
            variant='outline'
            type='button'
            className='w-full flex items-center justify-center gap-2'
            onClick={() => loginWithLinkedIn()}
          >
            <Linkedin size={16} />
            Sign up with LinkedIn
          </Button>
          <Button
            variant='outline'
            type='button'
            className='w-full flex items-center justify-center gap-2'
            onClick={() => loginWithGoogle()}
          >
            <svg width='16' height='16' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
              <path
                d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                fill='#4285F4'
              />
              <path
                d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                fill='#34A853'
              />
              <path
                d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                fill='#FBBC05'
              />
              <path
                d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                fill='#EA4335'
              />
            </svg>
            Sign up with Google
          </Button>
        </div>

        <div className='relative my-6'>
          <div className='absolute inset-0 flex items-center'>
            <Separator className='w-full' />
          </div>
          <div className='relative flex justify-center text-sm'>
            <span className='px-2 text-gray-500 bg-white'>Or continue with</span>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <User className='absolute left-3 top-2.5 h-5 w-5 text-gray-400' />
                      <Input placeholder='John Doe' className='pl-10' {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Mail className='absolute left-3 top-2.5 h-5 w-5 text-gray-400' />
                      <Input placeholder='you@example.com' className='pl-10' {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Lock className='absolute left-3 top-2.5 h-5 w-5 text-gray-400' />
                      <Input
                        type='password'
                        placeholder='******'
                        className='pl-10'
                        {...field}
                        onChange={e => {
                          field.onChange(e);
                          // Check password strength as user types
                          setPasswordStrength(
                            SecurityUtils.validatePasswordStrength(e.target.value)
                          );
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                  {field.value && field.value.length > 0 && (
                    <div className='mt-2'>
                      <div className='flex items-center gap-1 text-xs'>
                        <ShieldCheck
                          size={14}
                          className={passwordStrength.isValid ? 'text-green-500' : 'text-gray-400'}
                        />
                        <span
                          className={passwordStrength.isValid ? 'text-green-500' : 'text-gray-500'}
                        >
                          {passwordStrength.isValid
                            ? 'Password meets security requirements'
                            : 'Password strength'}
                        </span>
                      </div>
                      {!passwordStrength.isValid && passwordStrength.errors.length > 0 && (
                        <ul className='text-xs text-amber-600 mt-1 list-disc pl-5'>
                          {passwordStrength.errors.map((error, index) => (
                            <li key={index}>{error}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Lock className='absolute left-3 top-2.5 h-5 w-5 text-gray-400' />
                      <Input type='password' placeholder='******' className='pl-10' {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='acceptTerms'
              render={({ field }) => (
                <FormItem className='flex flex-row items-start space-x-3 space-y-0'>
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className='space-y-1 leading-none'>
                    <FormLabel className='text-sm'>
                      I accept the{' '}
                      <Link to='/legal/terms' className='text-blue-600 hover:text-blue-500'>
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link to='/legal/privacy' className='text-blue-600 hover:text-blue-500'>
                        Privacy Policy
                      </Link>
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            {registerError && (
              <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative flex items-center gap-2'>
                <AlertTriangle size={16} />
                <span>{registerError}</span>
              </div>
            )}

            <Button type='submit' className='w-full' disabled={isSubmitting}>
              {isSubmitting ? 'Creating account...' : 'Create account'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Register;
